"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-sky-950 text-sky-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">East Africa Jobs</h3>
            <p className="text-sm text-sky-200">
              Connecting talented professionals with the best opportunities across East Africa.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-sky-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-sky-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-sky-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-sky-200 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-sky-200 hover:text-white transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sky-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sky-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sky-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sky-200 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Job Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Job Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs?category=technology" className="text-sky-200 hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=healthcare" className="text-sky-200 hover:text-white transition-colors">
                  Healthcare
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=finance" className="text-sky-200 hover:text-white transition-colors">
                  Finance
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=education" className="text-sky-200 hover:text-white transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=marketing" className="text-sky-200 hover:text-white transition-colors">
                  Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 text-sky-300" />
                <span className="text-sky-200">123 Business Street, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-sky-300" />
                <span className="text-sky-200">+254 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-sky-300" />
                <span className="text-sky-200">info@eastafricajobs.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sky-800 mt-12 pt-8 text-center text-sm">
          <p className="text-sky-200">© {new Date().getFullYear()} East Africa Jobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
