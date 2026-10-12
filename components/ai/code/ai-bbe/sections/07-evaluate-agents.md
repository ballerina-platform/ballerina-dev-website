---
title: 'Build your agent. Put it to the test.'
id: 'evaluate-agents'
description: "Evaluate responses and tool behavior against representative scenarios. Combine rule-based checks with model-based judging to detect regressions when instructions, tools, or models change."
details: "Before a prompt, tool, or model change ships, the order support agent runs against a dataset of conversations. Rules check tool names, arguments, and call order, and a judge model compares each answer with a reference answer. The evaluation is an ordinary Ballerina test built on `ai:Trace`, `ai:loadConversationThreads`, and the `runs` and `minPassRate` fields of `@test:Config` (Ballerina 2201.13.2 or later). There is no built-in judge; the judge is a model call that you write. A failed check and a failed run both fail an entry, so the sample tags them `[CHECK]` and `[EXEC]`. The report was captured against a scripted mock model that simulates one regression and one rate limit. A real judge can also be wrong, so review a sample of its verdicts."
guide: { label: 'Evaluate agent behavior', url: '/learn/evaluate-agent-behavior/' }
samples:
  - { label: 'Complete evaluation project: broadband support agent (in the guide)', url: '/learn/evaluate-agent-behavior/#the-complete-code' }
  - { label: 'Data-driven tests (BBE)', url: '/learn/by-example/testerina-data-driven-tests/' }
tabs:
  - { key: 'evaluation', title: 'Code' }
  - { key: 'checks', title: 'Checks' }
  - { key: 'dataset', title: 'Dataset' }
  - { key: 'report', title: 'Report' }
---
