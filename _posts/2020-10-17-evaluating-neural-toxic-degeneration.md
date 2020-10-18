---
layout: distill
title:  "Review: <i>Evaluating Neural Toxic Degeneration in Language Models</i>"
date:   2020-10-17 11:00:00
description: Language Models suffer from degenerate and biased behavior, can we fix that?
readtime: 8.4

authors:
  - name: A.L.
---

This review is on "[RealToxicityPrompts: Evaluating Neural Toxic Degeneration in Language Models](https://api.semanticscholar.org/CorpusID:221878771)" from a group of researchers at the University of Washington and the Allen Institute for AI, to be found in the *Findings of EMNLP 2020* <d-footnote><a href="https://2020.emnlp.org/blog/2020-04-19-findings-of-emnlp" target="_blank">A new (as of April 2020) "companion" to EMNLP</a> which offers sort of a middle group between rejection and acceptance into the main conference. It seems like a happy middle ground for still notable research.</d-footnote>. The authors set the stage by saying,

> language models (LMs) pretrained on large web text corpora suffer from degenerate and biased behavior

To no one's surprise, LMs are being deployed at an increasing pace due to the popularity of tools such as [huggingface](https://huggingface.co/){:target="_blank"}. The authors contribute to recent work on LMs by first offering an operationalization of toxic model generations, then introduce a novel dataset of labeled toxic and non-toxic phrases, and then demonstrate the danger of LMs (even when tuned to avoid toxic language). The authors evaluate a few different methods for preventing toxic language generation, although none is perfect. Lastly, they partially diagnose what's causing bad generations (hint: garbage in, garbage out), and offer some recommendations to ameliorate the issue.

I was interested in this paper because it is one of those that integrates both NLP and sociolinguistics. Before even trying to prevent a LM from spitting forth profanity, one has to define and operationalize some very tricky subjects. What exactly is profanity? What is toxicity? At what point does a word move from being uncomfortable or taboo to profane or marginalizing? How does the definition of toxic change from person to person? Can something be profane when said by one person, but not another? Only one, maybe two, of these is discussed in this article, but I found them useful to consider while reading.

## Language Model Background

Before beginning, I'll give a bit of background on generative Language Models. In plain English, a Language Model scans huge collections of documents (millions of documents), word by word, learning statistical associations between words and their neighbors, and is then able to predict the next word in a phrase by just looking for the most probable in the English language. Your iPhone does this (if you have predictive typing turned on), as does Gmail when you're drafting an email, and a suite of other tools.

You may have heard of GPT-3 (and [it's predecessors](https://openai.com/blog/gpt-2-1-5b-release/){:target="_blank"})<d-footnote>For an excellent illustrated explanation, I recommend <a href="http://jalammar.github.io/illustrated-gpt2" target="_blank">the classic from Jay Alammar</a>.</d-footnote>, which has been [in](https://www.theverge.com/21346343/gpt-3-explainer-openai-examples-errors-agi-potential){:target="_blank"} [the](https://www.technologyreview.com/2020/07/20/1005454/openai-machine-learning-language-generator-gpt-3-nlp/){:target="_blank"} [news](https://www.theguardian.com/commentisfree/2020/sep/08/robot-wrote-this-article-gpt-3){:target="_blank"} [a lot](https://www.vox.com/future-perfect/21355768/gpt-3-ai-openai-turing-test-language), or of [BERT](https://towardsdatascience.com/bert-explained-state-of-the-art-language-model-for-nlp-f8b21a9b6270){:target="_blank"}, which might have received more attention in the academic press than the public press. The GPT family and BERT are both Language Models. GPT is distinct from BERT though in that it is *auto-regressive*, meaning it progressively sees and trains on more of the sentence as it reads, instead of seeing the whole sentence at once. This is what makes it particular useful for predicting what will comes next, making it *generative*.

## Operationalizing Toxicity

The authors state the importance of having well-annotated data, and that the definition of "toxic" is crucial to their argument, although they pass off the responsibility to another tool. They do correctly note that hand-annotating such a large dataset is unfeasible. In the end,

> We rely on [Perspective API](https://www.perspectiveapi.com/){:target="_blank"}, an automated tool for toxic language and hate speech detection

The API, when given a linguistic form (e.g., a sentence), calculates a score, or probability of toxicity. The authors then (perhaps unjustifiably) label an input prompt as toxic if it has a score of over 0.5, otherwise it's labeled non-toxic. The authors confess that the API likely suffers from an over-reliance on lexical cues to detect toxicity, where lexical cues basically just means specific words, such as swear words or slurs.

## *RealToxicityPrompts* Dataset

One of the main contributions of the paper is the dataset the authors compiled. It consists of 100,000 sentences, spanning the whole range of toxicities, that were split in half into a *prompt* and a *continuation*. Both halves were scored for toxicity. Their hope is that by creating this big dataset of English web text scored for toxicity, others will be able to "systematically evaluate and compare the generations from language models" with this "testbed for toxicity."

## Detoxifying Model Generations

<div class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 col-md-8">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/toxicity-generations.png">
    </div>
</div>
<div class="caption">
    <strong>Figure 1.</strong> Four non-toxic prompts which cause several pretrained LMs to generate highly toxic output. Credit: Gehman et al. (2020)
</div>

As illustrated in Figure 1, even non-toxic prompts (those with a toxicity score from Perspective less than 0.5) lead to toxic generations. The crux of the paper is in their assessment of five ways to detoxify LM generations. Below are quick summaries of these methods and how they reduce toxic generations.

### Data-Based Detoxification

Domain-Adaptive Pretraining (DAPT)
: Perform additional pretraining on a smaller *non-toxic* corpus.

Attribute Conditioning
: Perform additional pretraining on a sample of the corpus which has been labeled with either a toxic attribute token, `<|toxic|>`, or a non-toxic attribute token, `<|nontoxic|>`. During generation, prepend the prompt with `<|nontoxic|>` specifically.

### Decoding-Based Detoxification

Vocabulary Shifting
: Modify the decoding algorithm to give higher probability to non-toxic tokens. Learns a weight for each vocabulary token which represents the association between each token and (non-)toxicity.

Word Filtering
: Create a blacklist of profanity, slurs, and swearwords and set the probability of generating those words to zero to prevent the LMs from generating them altogether.

[PPLM](https://openreview.net/pdf?id=H1edEyBKDS){:target="_blank"}
: Combine a pretrained, unconditional language model with one or more simple attribute models, which are small and cheap models that figure out latent gradients between attributes and the pretrained language models to steer outputs.

### Results

As one might expect, none of these detoxification methods completely eradicated toxic generations; and toxic prompts yielded higher toxicity in generation than non-toxic prompts. What's somewhat surprising is that non-toxic prompts occasionally also led to toxic generations. It should be clear then that even benign models can be harmful. The authors point out that it's also surprising that the CTRL-WIKI model produced toxic content, despite being pretrained to generate Wikipedia-style output<d-footnote>The authors also state it's interesting since "[the model] was trained on just Wikipedia." I'm not sure this statement is true after skimming the original CTRL paper from Kaskar et al. (2019).</d-footnote>. Furthermore, DAPT is one of the most effective methods (which I found surprising, given its simplicity), along with vocabulary shifting, and PPLM. The authors lastly state that steering generations after pretraining must thus be crucial for preventing toxic output.

There were some phrases, which when used to prompt the models consistently returned toxic generations. These prompts were often toxic themselves or had the opening phrase of known toxic sentences ("his rant was full of..."). Lastly, about 10% of the prompts came from unreliable or toxic data sources, which we get into next.

## Analysis of Web Text Toxicity

<div class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 col-md-6">
        <img class="img-fluid rounded z-depth-1 align-left" src="{{ site.baseurl }}/assets/img/toxicity-corpora.png">
    </div>
</div>
<div class="caption">
<strong>Figure 2.</strong> About 2.1% and 4.3% of OWTC and OpenAI-WT (the corpora which the x and x models were trained on) are toxic content (note: log-transformed y-axis). Credit: Gehman et al. (2020)
</div>

Up next, the authors attempt to quantify the toxicity present in the training data for the LMs they tested. Specifically, the training data were OpenAI-WT (GPT-2's training data) and its open-source replica OWTC. There is about 29% overlap between the two datasets, which is low enough to come to interesting conclusions about how the models may be affected by their training data.

In Figure 2 (note: it's log-transformed), we can see that about 2.1% and 4.3% of OWTC and OpenAI-WT are toxic content. About 3% of OWTC in fact comes from links shared on banned or quarantined subreddits<d-footnote>Banned subreddits are inaccessible via the website and only via data dumps, whereas quarantined subreddits are special-access only but still online.</d-footnote>.

## Recommendations

The authors conclude with a discussion and a variety of recommendations for NLP researchers. First, it should seem apparent that there's an issue with LMs generating toxic content. From the analysis of the training corpora, we might guess that this degeneracy comes from poor training data. They concede that the steering methods did have some positive effect, but did not completely resolve the problem. There are three primary implications proposed:

1. "Can language models ever fully 'forget' toxic pretraining data through further adaptation?"

    Essentially, you can start with a model trained on some bad data, but is there any amount of finite data you could then continue pretraining on to wash out, to "forget", the bad stuff? It seems as though the LMs are "memorizing" the bad content, which might come from such content being more salient to the model. The authors recommend for future work to explore whether some types of toxicity are more difficult for models to forget.

2. Purposeful decoding

    One of the most promising methods of eliminating toxic generations was PPLM. Perhaps there exist other methods to aid in the decoding phase and prevent toxic generation. For example, using handpicked toxic documents as "negative examples" which the model would learn not to produce. The authors also nebulously suggest "infusing models with more sophisticated or nuanced representations of social biases."

3. Choice of Pretraining Data

    The authors also call for a dramatic introspection of the training data with which LMs learn on. Some issues arise when relying on huge swathes of data with very little filtering e.g., Reddit is known to have a biased user-base. This should call to question: "who decides whose voices are going to be learned by the language model." One appealing recommendation is to make the pretraining process more human-centered, including through participatory design.

    The authors lastly caution that curating pretraining data without deep thought might have unintended side-effects, such as filtering out benign text from African American authors/users. They suggest engaging with the end-user during this phase.

## Take-aways

It's a compelling and mostly uncontroversial article, which clearly highlights shortcomings currently in NLP. I think too little is said about the impact on industry (companies are currently trying to solve this problem), and society as a whole. In fact, regarding the latter, I think more could have been said about the practical implications of LM degeneration on the spreading of misinformation. In sum though, the authors created a valuable dataset for future research, and exposed a lower bound on toxicity degeneracy in LMs.

I'm also a little unsatisfied by the authors' operationalization of toxicity. While I understand their desire to create a large dataset for other researchers to train on, I'm not sure the Perspective API should be considered the end of the conversation. Undoubtedly, it will produce false positives and false negatives (which the authors briefly mentioned), which should lead us to question if their assessments are answering the right questions. If their ground truth is not what a human would believe, then this could easily disrupt their main claims.

Lastly, on the topic of what humans would believe: some people find some things offensive, others don't. Are the authors (or by proxy, Perspective) justified in claiming what is toxic and what is not? More philosophically, can someone speak for someone else on what is right or wrong?
