"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, BrainCircuit, Send, ChevronDown, ChevronUp, UserCheck, Star } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Header from '@/components/Header';

export default function LandingPage() {
  const scrollYProgress = useScroll().scrollYProgress;
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const patternSvg = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='1'/%3E%3Cpath d='M30 60L0 30' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='1'/%3E%3C/svg%3E`;

  return (
    <div className="min-h-screen bg-dark text-cream font-medium selection:bg-cream selection:text-dark overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.25]" style={{ backgroundImage: `url("${patternSvg}")`, backgroundSize: '70px' }}></div>

      <Header />

      <main className="relative w-full">
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
          <motion.div
            style={{ y }}
            className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-linear-to-t from-dark via-transparent to-transparent"
          />

          <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-20 items-center text-left">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-start"
            >
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[4rem] font-black tracking-tight leading-none mb-8 text-cream uppercase">
                Where Talent <br />
                <span className="italic font-serif opacity-90 tracking-normal">Meets True Value.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-cream/70 max-w-xl mb-12 leading-relaxed font-medium">
                The premier AI-powered recruitment engine. Screen, rank, and shortlist candidates with uncompromising precision, keeping humans firmly in control.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5">
                <Link href="/jobs" className="bg-cream text-dark px-10 py-4 rounded-md text-md font-semibold hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl">
                  Start Screening <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#workflow" className="border border-cream text-cream px-10 py-4 rounded-md text-md font-semibold hover:bg-cream/10 transition-all duration-300 flex items-center justify-center shadow-lg">
                  Explore Workflow
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="relative group hidden lg:block"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-cream/20 to-transparent rounded-lg blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative border border-cream/30 bg-dark p-8 rounded-md shadow-2xl overflow-hidden min-h-[500px] flex flex-col mt-16">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cream/40 to-transparent opacity-50"></div>

                <div className="flex items-center justify-between mb-8 pb-4 border-b border-cream/10">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
                    </div>
                    <span className="text-[16px] font-bold text-cream/40 ">Bora AI</span>
                  </div>
                  <div className="text-[16px] font-bold text-cream/60 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Live_Analysis
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <div className="text-[16px] font-bold text-emerald-500/80">Pipeline Status</div>
                    <div className="h-2 w-full bg-cream/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '84%' }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-cream"
                      ></motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-cream/10 bg-cream/5 rounded-md">
                      <div className="text-[10px] text-cream/40 uppercase font-bold mb-1">Total Resumes</div>
                      <div className="text-2xl font-black text-cream">1,280</div>
                    </div>
                    <div className="p-4 border border-cream/10 bg-cream/5 rounded-md">
                      <div className="text-[10px] text-cream/40 uppercase font-bold mb-1">Top Matches</div>
                      <div className="text-2xl font-black text-cream">42</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="p-4 border border-cream/20 bg-dark rounded-md flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-cream/10 border border-cream/20 flex items-center justify-center text-cream">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-cream">Alexander C.</div>
                          <div className="text-[10px] text-cream/50">Senior Engineer</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-cream">98%</div>
                        <div className="text-[9px] uppercase font-bold text-emerald-500">Perfect</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING DECORATIONS */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 -right-6 p-4 border border-cream/30 bg-dark rounded-md shadow-xl backdrop-blur-md z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-emerald-500" fill="currentColor" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-cream">High Parity</div>
                    <div className="text-[9px] text-cream/40 uppercase">AI Verified</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 p-5 border border-cream/30 bg-dark rounded-md shadow-2xl backdrop-blur-md z-20 max-w-[180px]"
              >
                <div className="text-[10px] font-bold text-cream/40 uppercase mb-2">Efficiency Boost</div>
                <div className="text-3xl font-black text-cream mb-1">12.5x</div>
                <div className="text-[14px] text-emerald-500 font-bold">Faster Hiring</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-cream/20 bg-dark relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-x divide-cream/20">
              {[
                { label: 'Time Reclaimed', value: '80%' },
                { label: 'Screening Precision', value: '99.9%' },
                { label: 'System Integrations', value: '10+' },
                { label: 'Unbiased Output', value: '100%' },
              ].map((stat, i) => (
                <div key={i} className="text-center px-4">
                  <div className="text-4xl md:text-5xl font-black text-cream mb-4">{stat.value}</div>
                  <div className="text-lg text-cream/60 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-32 px-6 bg-dark">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-cream/20 pb-12 gap-6"
            >
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-cream/60 mb-4">Modern Recruitment</h2>
                <h3 className="text-4xl md:text-6xl font-black text-cream uppercase leading-none">Built For<br />Precision.</h3>
              </div>
              <p className="text-cream/70 max-w-sm text-lg md:text-right">
                BORA automates the heavy lifting of high-volume applicant screening so you can focus on finding the best.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { icon: Zap, title: "Instant Analysis", desc: "Process thousands of resumes in seconds utilizing Gemini AI context-aware parsing." },
                { icon: ShieldCheck, title: "Objective AI", desc: "Score candidates rigorously against explicit job parameters, ignoring bias." },
                { icon: BrainCircuit, title: "Deep Insights", desc: "Granular explanations for every candidate: strengths, weaknesses, parity." }
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeUp} className="group border border-cream/20 bg-dark p-10 rounded-md hover:bg-cream/5 transition-all duration-500">
                  <div className="mb-10 w-14 h-14 border border-cream/30 rounded-md flex items-center justify-center text-cream group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-bold uppercase text-cream mb-4 tracking-wider">{feature.title}</h4>
                  <p className="text-cream/60 text-base leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="workflow" className="py-32 px-6 relative overflow-hidden">

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-cream">The Pipeline</h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-12"
              >
                {[
                  { step: '01', title: 'Data Ingestion', desc: 'Securely import job parameters and structured CVs.' },
                  { step: '02', title: 'Intelligent Parsing', desc: 'Transform messy data into structured Talent Profiles.' },
                  { step: '03', title: 'Gemini Evaluation', desc: 'Run multi-dimensional comparisons for alignment.' },
                  { step: '04', title: 'Rank & Shortlist', desc: 'Generate accurate match scores and present the Top 10.' }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex gap-8 group">
                    <div className="text-5xl font-black text-cream/20 transition-all duration-300 group-hover:text-cream">
                      {item.step}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-xl font-bold uppercase tracking-wider text-cream mb-2">{item.title}</h4>
                      <p className="text-cream/60">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="border border-cream/30 bg-dark p-6 rounded-md lg:p-10 relative shadow-2xl">
                  {/* Decorative Elements */}
                  <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cream rounded-tl-sm"></div>
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-cream rounded-br-sm"></div>

                  <h5 className="uppercase text-xs font-bold text-cream/70 tracking-widest mb-6 pb-4 border-b border-cream/20">Output Terminal</h5>

                  <div className="space-y-3">
                    {[
                      { user: "Alexander C.", role: "Senior Backend Engineer", score: 98 },
                      { user: "Sarah T.", role: "Fullstack Developer", score: 94 },
                      { user: "Michael L.", role: "Node.js Developer", score: 87 }
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-cream/10 bg-cream/5 rounded-md hover:bg-cream/10 transition-colors">
                        <div>
                          <div className="text-cream font-bold">{row.user}</div>
                          <div className="text-cream/50 text-xs">{row.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-cream">{row.score}%</div>
                          <div className="text-[10px] uppercase font-bold text-cream/50 tracking-widest">Match</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 px-6 bg-dark border-t border-cream/20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-black uppercase text-cream tracking-tight mb-4">FAQ</h2>
              <p className="text-cream/60">Frequently asked questions about the BORA platform.</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-4"
            >
              {[
                { q: "How does the AI matching work?", a: "We utilize multi-dimensional Gemini AI prompts designed specifically to compare Applicant CV unstructured data directly against the stated Job Description requirements, producing a 0-100 unbiased score." },
                { q: "Is the data secure?", a: "Yes. All resumes and job parameters are securely stored. We respect privacy boundaries and do not train foundational models on your candidate CVs." },
                { q: "Can I customize the screening parameters?", a: "Absolutely. When creating a job, you can specific mandatory vs nice-to-have skills, giving the AI clear weighting directives." }
              ].map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 px-6 bg-dark border-t border-cream/20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("${patternSvg}")`, backgroundSize: '40px' }}></div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <h2 className="text-4xl md:text-7xl font-black uppercase text-cream mb-8 leading-none">
              Deploy Intelligence.
            </h2>
            <p className="text-xl text-cream/70 mb-12 font-serif italic">The future of hiring is objective, fast, and human-led.</p>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-4 bg-cream text-dark px-6 py-4 rounded-md text-md font-semibold hover:bg-white transition-colors">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>
      </main>

      <footer id="contact" className="border-t border-cream/20 pt-20 pb-8 px-6 relative overflow-hidden">

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="col-span-1 md:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 border border-cream/30 bg-dark rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-3xl font-black tracking-widest uppercase text-cream">BORA</span>
              </div>
              <p className="text-cream/60 max-w-sm text-sm leading-relaxed mb-6">
                Celebrating objective precision and the power of human hiring. Screen resumes ethically. Hire authenticly.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-cream/10 transition-colors cursor-pointer"><FaInstagram className="w-4 h-4 text-cream" /></div>
                <div className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-cream/10 transition-colors cursor-pointer"><FaFacebook className="w-4 h-4 text-cream" /></div>
                <div className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-cream/10 transition-colors cursor-pointer"><FaTwitter className="w-4 h-4 text-cream" /></div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-bold text-cream text-[15px]">Explore</span>
                <div className="flex-1 h-px bg-cream/20"></div>
              </div>
              <ul className="space-y-4 text-cream/70 text-sm">
                <li><Link href="/" className="hover:text-cream transition-colors">Home</Link></li>
                <li><Link href="#features" className="hover:text-cream transition-colors">Features</Link></li>
                <li><Link href="#workflow" className="hover:text-cream transition-colors">Workflow</Link></li>
                <li><Link href="/jobs" className="hover:text-cream transition-colors">Jobs Portal</Link></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-bold text-cream text-[15px]">Support</span>
                <div className="flex-1 h-px bg-cream/20"></div>
              </div>
              <ul className="space-y-4 text-cream/70 text-sm">
                <li><a href="mailto:contact@bora.ai" className="hover:text-cream transition-colors">Contact Us</a></li>
                <li><Link href="/dashboard" className="hover:text-cream transition-colors">Dashboard</Link></li>
                <li><Link href="#faq" className="hover:text-cream transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-cream transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="col-span-1 md:col-span-4">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-bold text-cream text-[15px]">Newsletter</span>
                <div className="flex-1 h-px bg-cream/20"></div>
              </div>
              <p className="text-cream/70 text-sm mb-4">
                Join our community and get updates on platform features.
              </p>
              <div className="relative mb-4 flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-dark border border-cream/30 text-cream px-4 py-3 rounded-l-md outline-none focus:border-cream placeholder:text-cream/30 text-sm"
                />
                <button className="bg-cream text-dark px-5 py-3 rounded-r-md hover:bg-white transition-colors flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-cream/40 italic">
                By subscribing, you agree to our terms and conditions.
              </p>
            </div>
          </div>

          {/* Copyright Area */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-cream/10 text-cream/50 text-xs gap-4">
            <div>© 2026 BORA. All Rights Reserved.</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-cream transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-cream transition-colors">Privacy Policy</Link>
            </div>

            {/* Scroll to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="absolute right-0 bottom-8 w-10 h-10 bg-cream text-dark rounded-md flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple FAQ Item Component
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="border border-cream/20 bg-dark rounded-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-cream hover:bg-cream/5 transition-colors focus:outline-none"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-cream/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-cream/60 text-sm leading-relaxed border-t border-cream/10 border-dashed mx-5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
