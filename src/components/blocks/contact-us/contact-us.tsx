import ContactForm from "@/components/blocks/contact-us/contact-form";
import { Card, CardContent } from "@/components/ui/card";

const ContactUs = () => {
  return (
    <section className="bg-muted py-8 sm:py-16 lg:h-dvh lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center sm:mb-16">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Get in touch for information, corrections, or collaboration
          </h2>
          <p className="text-muted-foreground text-xl">
            Send a message to report inaccurate information, editorial
            inquiries, or to suggest an AI topic worth covering.
          </p>
        </div>

        <Card className="border-none shadow-none">
          <CardContent className="grid gap-12 md:grid-cols-2">
            <div className="md:col-span-2">
              <ContactForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactUs;