import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "John Mwangi",
    role: "Job Seeker",
    location: "Nairobi, Kenya",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "I found my dream job within two weeks of signing up. The platform is intuitive and connects job seekers directly with employers.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Omondi",
    role: "Business Owner",
    location: "Kampala, Uganda",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "As a small business owner, this platform has been invaluable for finding qualified staff and posting classified ads to promote my services.",
    rating: 4,
  },
  {
    id: 3,
    name: "David Kagame",
    role: "Importer",
    location: "Kigali, Rwanda",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "The HSN code search functionality has made it so much easier to find exporters for specific products. Highly recommended!",
    rating: 5,
  },
  {
    id: 4,
    name: "Grace Mushi",
    role: "HR Manager",
    location: "Dar es Salaam, Tanzania",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "We've hired multiple candidates through this platform. The quality of applicants is excellent, and the interface is user-friendly.",
    rating: 4,
  },
  {
    id: 5,
    name: "Peter Obote",
    role: "Job Seeker",
    location: "Entebbe, Uganda",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "The job alerts feature kept me updated on new opportunities in my industry. I secured a position much faster than expected.",
    rating: 5,
  },
]

export function UserTestimonials() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-300 dark:text-zinc-600"}`}
      />
    ))
  }

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">{renderStars(testimonial.rating)}</div>
                <blockquote className="text-zinc-700 dark:text-zinc-300 mb-4">"{testimonial.content}"</blockquote>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
