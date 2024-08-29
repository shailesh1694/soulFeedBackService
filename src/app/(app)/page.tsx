"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Mail } from "lucide-react";
import Autoplay from "embla-carousel-autoplay"

export default function Home() {


  const messages = [
    {
      "title": "Message from User123",
      "content": "Hey, how are you doing today?",
      "received": "10 minutes ago"
    },
    {
      "title": "Message from SecretAdmirer",
      "content": "I really liked your recent post!",
      "received": "2 hours ago"
    },
    {
      "title": "Message from MysteryGuest",
      "content": "Do you have any book recommendations?",
      "received": "1 day ago"
    }
  ]
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Soul Feedback - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4 flex justify-center">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </main>
      <footer className="text-center p-4 md:p-6 bg-gray-600 text-white">
        © 2024 Soul Feedback. All rights reserved.
      </footer>
    </>
  );
}
