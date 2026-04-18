import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Fr. Yesudas Ministries. We'd love to hear from you.",
};

const serviceTimes = [
  { day: "Sunday", time: "9:00 AM – 11:00 AM", label: "Main Worship Service" },
  { day: "Wednesday", time: "7:00 PM – 9:00 PM", label: "Prayer Night" },
  { day: "Friday", time: "6:00 AM – 7:30 AM", label: "Early Morning Prayer" },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#1B2A4A] py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 text-xs tracking-widest uppercase">
              Reach Out
            </Badge>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
              Contact Us
            </h1>
            <p className="font-body text-white/70 text-lg">
              We&apos;d love to hear from you. Fill out the form or reach us
              directly — our team will respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50">
              <h2 className="font-heading text-2xl font-semibold text-[#1B2A4A] mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Contact details */}
              <div className="bg-[#1B2A4A] rounded-2xl p-6 text-white">
                <h3 className="font-heading text-lg font-semibold text-[#D4A853] mb-5">
                  Contact Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#D4A853] mt-0.5 shrink-0" />
                    <p className="font-body text-sm text-white/80">
                      Fr. Yesudas Ministries,
                      <br />
                      Visakhapatnam, Andhra Pradesh,
                      <br />
                      India
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#D4A853] shrink-0" />
                    <a
                      href="tel:+91XXXXXXXXXX"
                      className="font-body text-sm text-white/80 hover:text-[#D4A853] transition-colors"
                    >
                      +91 XXXXX XXXXX
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#D4A853] shrink-0" />
                    <a
                      href="mailto:info@fryesudasministries.com"
                      className="font-body text-sm text-white/80 hover:text-[#D4A853] transition-colors"
                    >
                      info@fryesudasministries.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Service times */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50">
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="h-5 w-5 text-[#D4A853]" />
                  <h3 className="font-heading text-lg font-semibold text-[#1B2A4A]">
                    Service Times
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  {serviceTimes.map((s) => (
                    <div
                      key={s.day}
                      className="flex items-start justify-between gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-body text-sm font-semibold text-[#1B2A4A]">
                          {s.day}
                        </p>
                        <p className="font-body text-xs text-[#D4A853]">{s.label}</p>
                      </div>
                      <p className="font-body text-sm text-gray-500 text-right shrink-0">
                        {s.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map embed */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-border/50 bg-[#1B2A4A]/10 aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120928.31028439875!2d83.17526!3d17.72601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3943adcef8b5e1%3A0x4ee94e50d7c45e5a!2sVisakhapatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fr. Yesudas Ministries location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
