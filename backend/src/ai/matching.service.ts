import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'

export interface MatchReason {
  type: 'ai' | 'location' | 'experience' | 'skills'
  title: string
  description: string
}

export interface ScoredOpportunity {
  matchScore: number
  matchReasons: MatchReason[]
  [key: string]: unknown
}

const SHORTLIST_LIMIT = 20

@Injectable()
export class MatchingService {
  private readonly client: Anthropic

  constructor(private readonly config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get('ANTHROPIC_API_KEY'),
    })
  }

  async match(
    skills: string,
    location: string,
    languages: string[],
    opportunities: any[],
  ): Promise<ScoredOpportunity[]> {
    const shortlist = this._preFilter(skills, location, opportunities)
    try {
      return await this._claudeMatch(skills, location, languages, shortlist)
    } catch {
      return this._algorithmicMatch(skills, location, languages, shortlist)
    }
  }

  // ── Stage 1: stemmed pre-filter ───────────────────────────────────────────

  private _preFilter(
    skills: string,
    location: string,
    opportunities: any[],
  ): any[] {
    const userStems = new Set(this._tokenize(skills).map((s) => this._stem(s)))

    return opportunities
      .map((opp) => {
        const oppStems = new Set(
          ((opp.skills ?? []) as string[]).map((s) => this._stem(s)),
        )
        const skillScore = this._stemmedJaccard(userStems, oppStems)
        const locScore = this._locationScore(location, opp.location)
        // Keep anything with any skill overlap, or strong location match
        return { opp, preScore: 0.7 * skillScore + 0.3 * locScore }
      })
      .filter(({ preScore }) => preScore > 0)
      .sort((a, b) => b.preScore - a.preScore)
      .slice(0, SHORTLIST_LIMIT)
      .map(({ opp }) => opp)
  }

  private _tokenize(bio: string): string[] {
    return [
      ...new Set(
        bio
          .toLowerCase()
          .split(/\W+/)
          .filter((t) => t.length >= 3),
      ),
    ]
  }

  private _stemmedJaccard(a: Set<string>, b: Set<string>): number {
    if (!a.size || !b.size) return 0
    let intersection = 0
    for (const stem of a) if (b.has(stem)) intersection++
    return intersection / new Set([...a, ...b]).size
  }

  // Lightweight suffix-stripping stemmer tuned for trade/skill vocabulary.
  // Suffixes ordered longest-first so "ation" wins over "ion", etc.
  // Min stem length of 4 prevents over-stripping short root words.
  private _stem(word: string): string {
    const w = word.toLowerCase().trim()
    const suffixes = [
      'ication',
      'ational',
      'iness',
      'ation',
      'tion',
      'ment',
      'ness',
      'ing',
      'ian',
      'ist',
      'ity',
      'ery',
      'ery',
      'ry',
      'er',
      'ed',
      'al',
    ]
    for (const suffix of suffixes) {
      if (w.endsWith(suffix) && w.length - suffix.length >= 4) {
        return w.slice(0, -suffix.length)
      }
    }
    return w
  }

  // ── Stage 2: Claude re-rank ───────────────────────────────────────────────

  private async _claudeMatch(
    skills: string,
    location: string,
    languages: string[],
    opportunities: any[],
  ): Promise<ScoredOpportunity[]> {
    const prompt = `You are a job matching engine for informal workers in Nigeria.

User profile:
- Skills bio: ${skills}
- Location: ${location}
- Languages: ${languages.join(', ')}

Opportunities (pre-filtered shortlist, ${opportunities.length} items):
${JSON.stringify(opportunities, null, 2)}

For each opportunity, evaluate how well it matches the user's profile considering:
1. Skill overlap (semantic, not just exact — "tailor" covers "tailoring", "seamstress", "sewing")
2. Location proximity (same city/area scores highest; nearby areas score medium)
3. Language fit (user's languages vs opportunity language)

Return ONLY a valid JSON array with one object per opportunity in the same order, each with:
- "id": the opportunity id
- "matchScore": integer 0–100
- "matchReasons": array of 1–3 objects, each with "type" ("skills"|"location"|"experience"), "title" (short), "description" (one sentence explaining the match)`

    const message = await this.client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (message.content[0] as { type: string; text: string }).text
    const parsed: {
      id: string
      matchScore: number
      matchReasons: MatchReason[]
    }[] = JSON.parse(text)

    const scoreMap = new Map(parsed.map((p) => [p.id, p]))

    return opportunities
      .map((opp) => {
        const scored = scoreMap.get(opp.id)
        return {
          ...opp,
          matchScore: scored?.matchScore ?? 0,
          matchReasons: scored?.matchReasons ?? [],
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  // ── Algorithmic fallback ──────────────────────────────────────────────────

  private _algorithmicMatch(
    skills: string,
    location: string,
    languages: string[],
    opportunities: any[],
  ): ScoredOpportunity[] {
    return opportunities
      .map((opp) => ({
        ...opp,
        matchScore: Math.round(
          this._score(skills, location, languages, opp) * 100,
        ),
        matchReasons: [],
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  private _score(
    skills: string,
    location: string,
    languages: string[],
    opp: any,
  ): number {
    return (
      0.55 * this._skillOverlap(skills, opp.skills) +
      0.25 * this._locationScore(location, opp.location) +
      0.2 * this._languageScore(languages, opp.language)
    )
  }

  private _skillOverlap(bio: string, b: string[]): number {
    if (!bio || !b.length) return 0
    const aStems = new Set(this._tokenize(bio).map((s) => this._stem(s)))
    const bStems = new Set(b.map((s) => this._stem(s)))
    return this._stemmedJaccard(aStems, bStems)
  }

  private _locationScore(userLoc: string, oppLoc: string): number {
    const u = userLoc.toLowerCase()
    const o = oppLoc.toLowerCase()
    if (u === o) return 1.0
    if (u.includes(o) || o.includes(u)) return 0.7
    return 0.3
  }

  private _languageScore(userLangs: string[], oppLang: string): number {
    const langs = new Set(userLangs.map((l) => l.toLowerCase()))
    const opp = oppLang.toLowerCase()
    if (langs.has(opp)) return 1.0
    if (opp === 'english') return 0.7
    return 0.2
  }
}
