---
layout: page
title: A Revised Empirical Comparison of Supervised Learning Algorithms
description:
img: /assets/img/algorithm-scores.png
importance: 2
---

[Read the paper](https://github.com/liebscher/cogs118a-model-comparison/blob/master/Liebscher_COGS_118A_Final_Project_PUB.pdf){:target="_blank"} or [browse the code](https://github.com/liebscher/cogs118a-model-comparison/blob/master/){:target="_blank"}

For any classification problem, choosing a proper classifier and its parameters is critical for success. This paper is my attempt at pushing for methodical supervised machine learning. **I evaluate the performance of seven classification algorithms across four data sets.** For thoroughness, each classifier was tested over three independent trials, where each trial was subject to three partitions of the data. For each partition of the data, cross validation was performed. For each CV fold, an optimal set of hyper-parameters was found for the classifier using Bayesian Search. Contrary to traditional grid search, this method improves performance, takes advantage of the underlying parameter space with specific priors, and reduces redundant and insignificant searches. Performance overall proved that Random Forests, Gradient Boosted Trees, and RBF-SVM achieve the highest results. K-Nearest Neighbors may also be a viable solution but should be treated with care and precision.

*Tools: Python (pandas, numpy, scikit-learn, xgboost, scikit-optimize, multiprocessing), Github & git*
