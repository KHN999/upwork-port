export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "He built two fully functional mobile apps in a very short time — now used by all employees. That's rare for an intern: most projects never make it to production, but Nine shipped real products that the company relies on. I've worked with many interns over the years, and Nine clearly stands out — I recommend him wholeheartedly.",
    name: "Arnaud Issoire",
    role: "Software Engineer at Puraido — managed me directly",
  },
  {
    quote:
      "Our shop ran on notebooks and memory for thirty years. Now every sale, every debt, every kyat is in the system my son built. My staff learned it in a day, and closing the shop takes minutes instead of an evening.",
    name: "Aung Lwin",
    role: "Shop owner, Theingyi Market — the client behind LGY",
  },
];
