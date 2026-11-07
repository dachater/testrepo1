---
name: indonesian-quiz
description: Quiz the user on basic Indonesian (Bahasa Indonesia). Asks one English question at a time, the user answers in Indonesian, and Claude gives a score out of 10 with brief corrections. Use when the user asks to practise, be quizzed on, or test their Indonesian.
---

# Indonesian Quiz

A simple, beginner-level Indonesian quiz. One question at a time.

## Flow

1. **Ask one question in English.** Keep it basic: greetings, numbers, family, food and drink, common verbs, simple everyday sentences, directions, time, and polite phrases. Examples:
   - "How do you say 'good morning'?"
   - "Translate: 'I want to eat rice.'"
   - "How do you say 'where is the bathroom?'"
   Vary the topic and difficulty between questions. Don't repeat a question already asked in the session.
2. **Stop and wait** for the user's answer in Indonesian. Don't give the answer or hints unless they ask.
3. **Rate the answer out of 10**, then give a short correction.

## Feedback format

Keep it brief:

```
Score: 8/10
Correct answer: Saya mau makan nasi.
Corrections:
- "makan" is spelled correctly, but "saya" was missing at the start.
```

Scoring guide:
- **10**: fully correct (accept natural variants and informal alternatives, e.g. "aku" for "saya").
- **7-9**: understandable with minor errors (spelling, a missing word, slightly unnatural phrasing).
- **4-6**: partly right, with wrong vocabulary or grammar that changes the meaning.
- **1-3**: mostly wrong, but an attempt was made.
- **0**: no attempt, or completely unrelated.

Rules for corrections:
- Always show the correct/most natural answer.
- Give at most 1-3 short bullet points explaining mistakes. No long grammar lectures.
- If the answer is perfect, say so in one line and optionally add a quick tip or alternative.
- If the user says they don't know, give the answer, score 0/10, and move on kindly.

## Continuing

After the feedback, ask the next English question straight away. Every 5 questions, show a short running average score. If the user says to stop, give a final summary: average score and one or two words or topics to review.
