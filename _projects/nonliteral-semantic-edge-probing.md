---
layout: page
title: Nonliteral Semantic Edge Probing
description: Structure in Contextual Word Embeddings
img: /assets/img/tenney2019.png
importance: 1
---

[Browse the code](https://github.com/liebscher/edge-probing-nonliteral){:target="_blank"} or [read the paper](https://github.com/liebscher/edge-probing-nonliteral/blob/master/Nonliteral_Edge_Probing.pdf){:target="_blank"}

The introduction of contextual word embedding (CWE) models has led to improvements on a wide variety of tasks. Yet, the black-box nature of deep learning language models may be inhibiting further progress. Tenney et al (2019) introduced a novel edge probing framework to explore the syntactic and semantic information encoded within contextual embeddings. They assessed the degree to which these types of information are encoded in the embeddings through a series of traditional linguistic tasks. **Here, I expand this framework and study how nonliteral meaning may be also encoded within these embeddings.** Nonliteral meaning is often highly abstract, conceptual, and cultural. **I find that contextual embeddings do encode some level of nonliteral meaning, as distinguished by our probing of metaphor and metonymy detection tasks.**

*Tools: Python (pytorch)*
