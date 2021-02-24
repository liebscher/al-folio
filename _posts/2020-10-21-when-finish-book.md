---
layout: distill
title:  When will I finish that book?
date:   2020-10-21 17:20:00
description: here i build a probabilistic model to estimate when i'll finish a book
readtime: 11.6

authors:
  - name: A.L.

custom-javascript:
  - "https://code.highcharts.com/highcharts.js"
  - "https://code.highcharts.com/highcharts-more.js"
  - "/assets/js/2020-10-21-when-finish-book.js"
---

It's ironic that one of my first thoughts when I start a book is about when I'll finish it. That thought seems to stem from the feeling of knowing there're so many things to read, yet so little time<d-footnote>If there's a name for this feeling, please let me know. The Japanese term <a href="https://en.wikipedia.org/wiki/Tsundoku" target="_blank">Tsundoku</a> is not quite what I'm thinking.</d-footnote>. No matter how much I'm enjoying a book, I'm somehow always looking forward to what's next.

Consequently, I wanted to figure out when I'd finish a book. In this essay, I introduce a model to estimate the days needed to complete a book given a small sample of one's historical reading data for that book.

## Existing Methods

The *de facto* method to estimate the amount of time to complete a book is no more than simple algebra, with little flexibility and insight. Specifically, if we know we have 100 pages left, and we've already calculated that we read 2 minutes per page, it is clear that we'd need 200 minutes. If we set a goal to read 20 minutes a day, then we can estimate we'll be done in 10 days. This is fairly simple, and for that reason we're spared much interesting information. For example, how sure are we that we'll finish then? This also assumes we'll read every day, but that might not be true.

There's a quick solution to overcome this last point. One may have read 6 days of the last week, which in one sense means there's a 5/7 = 71.4% probability they'll read on any given day. This reader might say they need 10 reading days of *reading* to finish the book. If they know there's a 28.6% chance they won't read on a given day, where $$10*0.286 = 2.86 \approx 3$$, then they might conclude that they'll finish the book in 10 + 3 = 13 days.

This is easily extended to another simple model, where one might specify the frequency that they read. For example, they might say they read every other day, which doubles the estimate then. The same idea holds over reading once every 2 days, or 3, or whatever.

For many, this will suffice. For some, more is necessary.

## Data Generation

> the data analyst needs to incorporate the information describing the data collection process in the probability model used for analysis.

--- Gelman et al. (2013), *Bayesian Data Analysis*

Taking a step back, how might we conceptually model the act of reading? Well, suppose you're beginning a book. You wake up one morning, and, without commenting on whether nature is predetermined, let's say there's some probability you'll read your book on that day (for any duration).

Suppose you don't read; you'll simply log 0 hours. Suppose you do read; how much will it be?

There're a lot of factors that may enter the equation now, such as whether it's a weekend, the outside weather, or maybe whether you're nearing the end of the book and are motivated to read more to finish. For simplicity's sake, we'll assume that by some process, such as habit, you'll read about $$x$$ hours. For many people, $$x=0.25, 0.5,$$ or $$1.0$$ (plus or minus some), but this widely varies from person to person.

To put it all together, there's a probability you'll read on a given day, and when you do read, it might typically be around some number plus or minus a bit. With this model of how the world works (which probably fails in many ways, but for now we don't care), we can estimate when and how much we'll read, which can be used to calculate how many days left for us. Let's explore a case study with real numbers.

## Case Study

I am reading ''The Brothers Karamazov'' by Fyodor Dostoevesky at the moment. It's long, so naturally I'm curious when I'll finish it. I've used [the Bookly iOS application](https://getbookly.com/) to log most of my reading for the novel so far. I've been reading for a bit more than a week, and have made a point to read each day. So far, here is a sample of my historical data:

|     Date 	| Oct 4 	| Oct 5 	| Oct 6   	| Oct 7 	| Oct 8   	| Oct 9     | Oct 10    | Oct 11  | Oct 12    | Oct 13  |
|---------:	|-------	|-------	|---------	|-------	|---------	| --------  | --------  | ------  | --------  | ------  |
| Duration 	| 26:53 	| 28:25 	| 1:15:16 	| 47:35 	| 1:03:20 	| 1:01:21   | 1:01:56   | 44:55   | 1:06:28   | 24:23   |
|    Pages 	| 9     	| 9     	| 29      	| 15    	| 22      	| 22        | 26        | 15      | 26        | 9       |

Including my other data, on average, I read about 49.4 minutes per day, and 20.7 pages per hour (2.9 minutes per page). At this point, I'm 321 pages in, with 475 to go. That means roughly 22.9 hours remaining. So far I've read every day. The naive estimate explained above puts me at 23 days away from completion.

However, I know I won't read every single day, and I'd like to account for this variation. Moreover, it is of little help to have just a point estimate. If possible, I'd like to know a probable range in which I'll finish (for all I know without accounting for the variation, this point estimate might stretch from 10 to 100 days).

## Modeling

If you're not interested in the math, you can skip to the next section.

First off, let our potential data be denoted $$y = (y_1, \ldots, y_N)$$. Soon we'll introduce what values these can take on.

Let $$B$$ be the event that we read on a given future day. We can model $$B$$ as a Bernoulli random event, $$B \sim \text{Bern}(\theta)$$ where $$\theta$$ is the probability of a positive result form the event. If $$\theta = 0.9$$, then we'd say there's a 90% probability we'll read on a given future day.

Let $$Y$$ be the event denoting the number of hours (in decimal form) we read on a given day *when we do read*. Using our historical data, we can model $$Y$$ as with a Student's t distribution, to account for greater uncertainty if we have very little data, namely $$Y \sim \text{t}_\nu (\mu, \sigma)$$ where $$\nu$$ is the degrees of freedom of the distribution, and $\mu$ and $\sigma$ denote the mean and the standard deviation of the distribution. Including the mean and variance with the Student's t distribution I think is slightly unorthodox, but concisely and conveniently allows us to vary them both. Now, if $$\mu = 1.0$$ for example, then we'd say that we're most likely to read an hour a day when we do read. Of course, it is technically false for us to claim that $$Y$$ is Student's t-distributed since in no world can we read less than zero hours in a day!<d-footnote>I've been thinking of how to model this as a positive continuous distribution, but I'm still new to this world and wanted to restrain myself for the time being. If you have helpful comments, please share.</d-footnote> This is merely a computational convenience. However, in the model parameter specifications, we won't let the sampler sample values less than 0.

Finally, to flesh out $y$, we'll say:

<p>
$$
y_i \sim \begin{cases}
      \text{t}_\nu (\mu, \sigma) & \text{if}\;B_i \\
      0 & \text{otherwise}
   \end{cases}
$$
</p>

To incorporate all the necessary variance, we also will define the distributions of $$\theta$$, $$\mu$$, and $$\sigma$$ ($$\nu$$ will be supplied in the problem by the amount of data we're inputing). A perfect distribution for a Bernoulli probability is the Beta distribution, so $$\theta \sim \text{Beta}(1,1)$$. $$\mu$$ will be modeled by a normal distribution, centered around 10 minutes per day with a bit of variance (this number comes from a national average of how much Americans read per day). Lastly, $\sigma$ will be modeled by an inverse Gamma, with $$\alpha = 0.07/0.93$$ (to center the distribution over 0.93 hours) and $$\beta = 1$$. All three of these help establish the larger model as a completely random data generation process. In `rstan` this looks like:

```
parameters {
  real<lower=0> mu;
  real<lower=0> sigma;
  real<lower=0,upper=1> theta;
}

model {
  theta ~ beta(1,1);
  mu ~ normal(0.1667, 1);
  sigma ~ inv_gamma(0.07/0.93, 1);

  B ~ bernoulli(theta);
  Y ~ student_t(N, mu, sigma);
}
```

We're making some arguable assumptions here as well. First, that each day is independent of the others<d-footnote>My knowledge is limited on how to treat this assumption, but perhaps <a href="https://arxiv.org/pdf/1505.04321.pdf" target="_blank">sequential estimation</a> might be in order.</d-footnote>. Surely there's also some psychological feeling of not wanting to break my reading streak, subliminally pushing me to reading each day. Here, we're saying every day is a fresh day. Second, when we do read, the amount that we read is a random draw from a friendly distribution<d-footnote>As mentioned, this is likely an incredibly complex distribution, but like any statistician with proper due diligence, we're reducing it to one of those incredibly natural, perfectly symmetrical distributions.</d-footnote>.

## Prediction

With our model established, we would like to predict when we'll finish our book. This harks back to our original question. So how do we do it?

I will illustrate first with an example. Suppose we're reading a book and know *a priori* that we have 10 hours remaining. We then calculate our reading pace so far, perhaps it's 0.5 hours per day. Suppose also we've read 5 of 7 of the past days.

Then, to determine the number of days remaining, we'll start at day 1. On day 1, will we read? The probability we do will lie somewhere around $$\hat{\theta}$$. Suppose we don't read though. Fine, skip to day 2, still with 10 hours remaining. Will we read on day 2? Suppose we do, and in fact we end up reading about $$\tilde{\mu}_2$$ hours. To illustrate, let's say it's 24 minutes, or 0.4 hours.

So now we have $$10 - 0.4 = 9.6$$ hours remaining. Again, flip a biased coin (with probability of heads at $$\hat{\theta}$$). It's heads, so we read again on day 3. This time, $$\tilde{\mu}_3 = 0.6$$ hours. Now there's $$9.6-0.6 = 9.0$$ hours remaining.

Follow this procedure while $$10 - \sum^k_{i=1} B_k(\hat{\theta}) * \tilde{\text{t}}_{k+1} (\mu_k, \sigma_k) > 0$$ (roughly). In the end, what is $k$? Well, it is the number of days necessary to exhaust the pages in our book, given estimates of how often and how much we already read.

In `R`, the algorithm looks like such:

```
draw <- function(remaining_hours, posterior_theta, posterior_mu, posterior_sigma) {

  total_read <- 0
  days <- 0

  while (total_read < remaining_hours) {

    to_read <- rbernoulli(1, sample(posterior_theta, size = 1))
    if (to_read) {

      mu <- sample(posterior_mu, size = 1)
      sigma <- sample(posterior_sigma, size = 1)
      est <- sigma * rt(1, df = days+1) + mu

      if (est < 0 || est > 8) next;

      total_read = total_read + est
    }
    days = days + 1
  }
  return(days)
}
```

## Results

Let's go back to my case study for ''The Brothers Karamazov''. If we fit the model with my historical reading data for the book, our model samples each parameter like so:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/parameter-estimates.png">
    </div>
</div>
<div class="caption">
    4,000 samples drawn for each parameter to estimate the parameter values.
</div>

Ultimately, the estimates for each parameter are: $$\hat{\mu} = 0.81$$, $$\hat{\sigma} = 0.37$$, and $$\hat{\theta} = 0.95$$. This means there's an average 95% probability I'll read on a given day, and when I do read it will on average be 48.6 minutes.

Using the algorithm described above, we will sample 2,000 draws of the posterior predictive distribution, which uses $$\mu$$, $$\sigma$$, and $$\theta$$ to determine the number of days remaining. Therefore, the posterior predictive distribution of the days remaining, given a sample of my historical reading data, looks like:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        <img class="img-fluid rounded z-depth-1" src="{{ site.baseurl }}/assets/img/days-remaining-hist.png">
    </div>
</div>
<div class="caption">
    Histogram of days remaining on my book drawn from the posterior predictive distribution
</div>

The mean here is 28.7, with a median of 29 (89% Credible Interval: [24, 34])<d-footnote>For an explanation of why I'm using 89% Credible Intervals, see <a href="https://easystats.github.io/bayestestR/articles/credible_interval.html#why-is-the-default-89" target="_blank">this nice summary</a>. In short, all intervals are arbitrary, so why not pick one that's slightly less arbitrary.</d-footnote>. We can take this one step further and visualize how the prediction accuracy improves over time (i.e. with more data).

For each day in sequence, we can re-estimate the model parameters (with progressively more data). On each re-fit, we'll add up the hours we estimate we have left and the hours we know we will read on future days to say how long it will take to finish *from that day*. As we artificially gain information, our estimates naturally become more precise. This is because we home in on a better estimate for how often we read and much we read when we do. We can find 95% and 68.2% credible intervals as well. In fact, we can nicely display this all as such:

<div id="container" style="width:100%; height:400px;"></div>
<div class="caption">
    As our model sees more data with each new day, the parameter estimates become more precise. The dotted line represents the estimates from the simple model describes in the intro (pages remaining / cumulative pace). The complex model is much more pessimistic, eventually the two will converge though.
</div>

We can see that the number of days remaining is decreasing over time, since we are taking off an absolute number of pages from the book. We can also see that our estimation is getting more precise, as a result of relying less on the priors and more on the data. You can also see how our model built here compares to the prediction from the simple model explained in Existing Models. The complex model, which factors in a variety of sources of variance, reflects our day to day behavior better but is clearly more pessimistic. However, as I near the end of my book the two lines will converge.

To interpret this chart further, we might conclude that I am most likely to finish my book in 29 days, which at the time of writing is November 19, but there's a full 89% probability that I'll finish the book within 24 to 34 days.

Consider our original estimation: 23 days until completion. Although kind of close, it doesn't account for the fact that I might not read every day in the near future. Moreover, if I do end up missing a day, the complex model will adapt and project the date further out. The simple model simply won't change.

## Overall

Overall, this is a case study of how one might predict when they'll finish a book, but with a bit of humanity's pitfalls injected in it (there *is* some chance I won't read everyday!). I am happy to know how quickly I will finish my book since it allows me to set goals and feel good about my progress, knowing that sooner or later (most probably in less than Y days) I will be able to put the book aside and begin the next. I'm still a novice statistician, so if there's gross misunderstandings in my work, please point them out (even if you're not sure yourself).

Reading is not all a numbers game. And I'm not racing anyone. I am, however, eager to read as much as a can before I can't. Books are meant to be enjoyed. If you're not enjoying them while reading none of the above has any validity. It can be tempting to scold or punish yourself or feel guilty for not meeting your reading goal. If you do not meet the estimated average time to completion---keep in mind that the distribution is infinite and some books will either take a *very* long time to finish, or will never be finished, and that's okay too.
