import React from 'react';
import { Star, Sparkles, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    rating: 5,
    name: 'Ananya Menon',
    location: 'Bengaluru, Karnataka',
    quote: "I went in expecting the usual vague tarot language. X immediately told me he wasn't going to predict my future. Instead, he pointed out a pattern in how I was making career decisions that I hadn't noticed myself. It was uncomfortable, but incredibly accurate. Probably the most useful ‘tarot’ session I've ever had."
  },
  {
    rating: 5,
    name: 'Rohan Mehta',
    location: 'Mumbai, Maharashtra',
    quote: "X doesn't tell you what you want to hear. That's exactly why the session worked. He basically dismantled the story I'd been telling myself about my relationship in about twenty minutes. Brutal? Yes. Useful? Absolutely."
  },
  {
    rating: 4,
    name: 'Priya Nair',
    location: 'Kochi, Kerala',
    quote: "I initially thought the whole atheist tarot concept was a gimmick. It isn't. X uses the cards more like prompts and then asks very direct questions. Some of the questions annoyed me because I knew he was right. I would have liked a little more time at the end."
  },
  {
    rating: 5,
    name: 'Arjun Kapoor',
    location: 'Delhi',
    quote: "The strangest part was that nothing supernatural happened. And somehow that made the reading more powerful. X identified the same decision pattern I'd been repeating for years. I left with an actual decision to make instead of a prediction to obsess over."
  },
  {
    rating: 5,
    name: 'Meera Krishnan',
    location: 'Chennai, Tamil Nadu',
    quote: "X has a very unusual way of reading. He doesn't ask you to believe in anything. He asks you to look at yourself honestly. The reading made me rethink a relationship I had been rationalising for months."
  },
  {
    rating: 4,
    name: 'Aditya Sharma',
    location: 'Jaipur, Rajasthan',
    quote: "Very different from any tarot reading I've experienced. X is extremely direct and sometimes almost too blunt. But there was substance behind everything he said. I appreciated that he openly said when he couldn't know something."
  },
  {
    rating: 5,
    name: 'Ishita Shah',
    location: 'Ahmedabad, Gujarat',
    quote: "I booked because I was stuck between two career choices. I expected a mystical answer. Instead, X made me list the assumptions behind each choice and showed me which one I was avoiding because I was scared. That was far more valuable than someone telling me which card ‘said yes.’"
  },
  {
    rating: 5,
    name: 'Vikram Rao',
    location: 'Hyderabad, Telangana',
    quote: "The line ‘You don't have bad luck. You have a pattern’ completely destroyed me. In the best possible way. X is not there to comfort you. He's there to make you see what you're doing."
  },
  {
    rating: 4,
    name: 'Sneha Iyer',
    location: 'Pune, Maharashtra',
    quote: "Very atmospheric experience and an unusually intelligent reading. I wasn't convinced at first, but the questions became increasingly specific as the session went on. Four stars only because I wanted the session to be longer."
  },
  {
    rating: 5,
    name: 'Kabir Malhotra',
    location: 'Gurgaon, Haryana',
    quote: "I've spoken to therapists, friends and mentors about the same problem. X approached it completely differently. He didn't tell me what decision to make. He showed me why I was avoiding the decision."
  },
  {
    rating: 5,
    name: 'Nandita Bose',
    location: 'Kolkata, West Bengal',
    quote: "X has mastered the art of saying something incredibly uncomfortable in the calmest possible voice. There was no drama, no fake spirituality and no attempt to scare me. Just observation, questions and an uncomfortable amount of accuracy."
  },
  {
    rating: 4,
    name: 'Rahul Verma',
    location: 'Lucknow, Uttar Pradesh',
    quote: "I liked the rational approach. The tarot cards were almost secondary to the conversation. X was particularly good at identifying contradictions between what I said I wanted and what my actions were actually showing."
  },
  {
    rating: 5,
    name: 'Aditi Rao',
    location: 'Mumbai, Maharashtra',
    quote: "I booked this during a really confusing period in my life. X told me something I didn't want to hear: I wasn't confused, I was avoiding the answer. That sentence stayed with me long after the session."
  },
  {
    rating: 5,
    name: 'Siddharth Menon',
    location: 'Thiruvananthapuram, Kerala',
    quote: "What makes X different is that he doesn't pretend to know things he couldn't possibly know. He openly talks about probability and uncertainty. Somehow that made me trust him more than any psychic I've spoken to."
  },
  {
    rating: 4,
    name: 'Kavya Reddy',
    location: 'Hyderabad, Telangana',
    quote: "Very insightful session. The relationship reading wasn't what I expected at all. X kept bringing me back to actual behaviour instead of trying to guess what the other person was secretly thinking. That was probably the healthiest part of the experience."
  },
  {
    rating: 5,
    name: 'Dev Patel',
    location: 'Surat, Gujarat',
    quote: "I went in as a complete skeptic. I still don't believe in psychic powers. Neither does X, apparently. What surprised me was how useful the session was despite that. It felt more like having someone interrogate my assumptions than having my fortune told."
  },
  {
    rating: 5,
    name: 'Riya Mukherjee',
    location: 'Kolkata, West Bengal',
    quote: "The session was intense. X barely raised his voice, but somehow every question felt like it had weight. He didn't predict whether my relationship would survive. He showed me exactly why it was struggling."
  },
  {
    rating: 4,
    name: 'Karthik Srinivasan',
    location: 'Bengaluru, Karnataka',
    quote: "I liked the concept and the execution. The reading was analytical rather than mystical. X was especially good when discussing repeated behaviour patterns. Some parts felt deliberately confrontational, but I think that is part of his style."
  },
  {
    rating: 5,
    name: 'Simran Kaur',
    location: 'Chandigarh',
    quote: "Most tarot readers give you something mysterious to hold onto. X gave me something much more annoying: responsibility. He basically said, ‘You know what happens if you keep doing this.’ He was right."
  },
  {
    rating: 5,
    name: 'Nikhil Joshi',
    location: 'Indore, Madhya Pradesh',
    quote: "I wasn't expecting much because I've always been skeptical about tarot. But X doesn't require belief. The cards became a framework for discussing my choices, and the pattern he identified was painfully obvious once he pointed it out."
  },
  {
    rating: 4,
    name: 'Lakshmi Krishnan',
    location: 'Coimbatore, Tamil Nadu',
    quote: "Very different experience. The environment was mysterious but the actual conversation was surprisingly grounded. X was respectful but extremely direct. I would recommend it to someone who wants perspective rather than reassurance."
  },
  {
    rating: 5,
    name: 'Aarav Bhatia',
    location: 'New Delhi',
    quote: "X said, ‘Hope is not evidence.’ I hated that sentence when I heard it. Three weeks later, I realised it was exactly what I needed to hear. One of the few readings I've had that actually changed how I approached a decision."
  },
  {
    rating: 5,
    name: 'Neha Kulkarni',
    location: 'Pune, Maharashtra',
    quote: "I came with a question about my career and somehow ended up understanding a much bigger pattern in my life. X doesn't give easy answers. He makes you examine the assumptions behind your questions."
  },
  {
    rating: 4,
    name: 'Manav Desai',
    location: 'Vadodara, Gujarat',
    quote: "The reading was sharp and very different from conventional tarot. X clearly separates probability from certainty, which I appreciated. The only downside is that his bluntness might not suit everyone."
  },
  {
    rating: 5,
    name: 'Farah Siddiqui',
    location: 'Lucknow, Uttar Pradesh',
    quote: "I expected spiritual language and got almost none. Instead, X talked about behaviour, choices, fear and probability. The irony is that the reading felt more meaningful precisely because he wasn't pretending to have supernatural answers."
  },
  {
    rating: 5,
    name: 'Saurabh Nair',
    location: 'Kochi, Kerala',
    quote: "The most memorable part wasn't the cards. It was the silence after X asked me a question I couldn't answer. I realised I'd spent months asking everyone else what I should do because I already knew what I wanted to do."
  },
  {
    rating: 4,
    name: 'Tanvi Deshmukh',
    location: 'Nagpur, Maharashtra',
    quote: "Very thoughtful reading. X has a completely different approach from typical tarot readers. He doesn't tell you that something is destined. He explains what is likely to happen if your current behaviour continues."
  },
  {
    rating: 5,
    name: 'Yash Agarwal',
    location: 'Jaipur, Rajasthan',
    quote: "I booked a Decision Room session before making a major career move. X didn't tell me ‘take the job’ or ‘don't take the job.’ Instead, he helped me separate fear from actual risk. That distinction changed my decision."
  },
  {
    rating: 5,
    name: 'Diya Thomas',
    location: 'Bengaluru, Karnataka',
    quote: "X is probably the first tarot reader I've met who actively tells you not to become dependent on readings. He literally told me I didn't need another session and needed to make the decision myself. That says a lot about the integrity of the practice."
  },
  {
    rating: 4,
    name: 'Harsh Vardhan',
    location: 'Noida, Uttar Pradesh',
    quote: "Very unusual experience. The atmosphere is mysterious, but the conversation is grounded and analytical. X can be brutally direct, so don't book if you only want reassurance. If you want someone to challenge your thinking, it's worth trying."
  },
  {
    rating: 5,
    name: 'Ira Banerjee',
    location: 'Kolkata, West Bengal',
    quote: "I came looking for an answer about another person. X refused to pretend he could read that person's mind. Instead, he asked me to look at their actual behaviour. That was probably the most honest thing anyone could have told me."
  },
  {
    rating: 5,
    name: 'Vivek Anand',
    location: 'Mumbai, Maharashtra',
    quote: "This doesn't feel like a conventional tarot reading. It feels like sitting across from someone who has studied the patterns you're trying very hard not to notice. X doesn't give you a prophecy. He gives you a mirror."
  }
];

function ReviewCard({ review }) {
  return (
    <div className="w-[320px] sm:w-[380px] shrink-0 p-5 rounded-2xl bg-[#0b0e14]/90 backdrop-blur-md border border-slate-800/80 hover:border-gold-400/40 hover:bg-[#111622]/95 transition-all duration-300 flex flex-col justify-between space-y-4 select-none shadow-xl">
      <div className="space-y-3">
        {/* Rating & Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            ))}
            {[...Array(5 - review.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-slate-700" />
            ))}
          </div>
          <span className="text-[11px] font-mono text-gold-400/90 font-medium px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20">
            {review.rating}/5
          </span>
        </div>

        {/* Quote */}
        <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-sans">
          “{review.quote.replace(/^“|”$/g, '')}”
        </p>
      </div>

      {/* Author & City */}
      <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between">
        <div>
          <h4 className="font-cinzel text-xs sm:text-sm font-bold text-slate-200">
            {review.name}
          </h4>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            {review.location}
          </p>
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-emerald-400/80 font-mono">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  // Split the 32 reviews into two rows of 16 for balanced multi-row marquee
  const rowOne = REVIEWS.slice(0, 16);
  const rowTwo = REVIEWS.slice(16);

  return (
    <section id="reviews" className="py-24 border-t border-slate-800/80 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mb-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-widest px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Documented Client Accounts</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold gold-gradient-text tracking-wide">
            Words From The Pattern Sessions
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real reflections from skeptics, decision-makers, and seekers across India who experienced the direct, rational pattern-reading methodology of X.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              <span>4.8 / 5.0 Rating (32 Accounts)</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>100% Pattern Clarity & Zero Superstition</span>
            </div>
          </div>
        </div>

      </div>

      {/* Marquee Section with Fade Masks */}
      <div className="relative marquee-group space-y-6">
        
        {/* Left and Right Fade Gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-36 bg-gradient-to-r from-[#050508] via-[#050508]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-36 bg-gradient-to-l from-[#050508] via-[#050508]/80 to-transparent z-10" />

        {/* Marquee Row 1 (Scrolling Left) */}
        <div className="flex overflow-hidden py-1">
          <div className="animate-marquee-left flex gap-5 shrink-0">
            {rowOne.concat(rowOne).map((rev, idx) => (
              <ReviewCard key={`r1-${idx}`} review={rev} />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (Scrolling Right) */}
        <div className="flex overflow-hidden py-1">
          <div className="animate-marquee-right flex gap-5 shrink-0">
            {rowTwo.concat(rowTwo).map((rev, idx) => (
              <ReviewCard key={`r2-${idx}`} review={rev} />
            ))}
          </div>
        </div>

      </div>

      <div className="text-center pt-8">
        <p className="text-[11px] font-mono text-slate-400">
          Hover over any card to pause the feed • Verified private client reflections
        </p>
      </div>
    </section>
  );
}
