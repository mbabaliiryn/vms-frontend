"use client";
import {useRouter} from "next/navigation";
import React from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {
    Wrench,
    Calendar,
    ClipboardCheck,
    BarChart3,
    Shield,
    Clock,
    Phone,
    MapPin,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ChevronRight,
} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";

export default function LandingPage() {
    const router = useRouter();
    useAuth();

    const features = [
        {
            icon: <Wrench className="w-12 h-12 text-orange-500"/>,
            title: "Repair Management",
            description:
                "Streamline repair workflows and track vehicle maintenance history with ease",
        },
        {
            icon: <Calendar className="w-12 h-12 text-orange-500"/>,
            title: "Appointment Scheduling",
            description:
                "Efficient booking system with automated reminders and calendar integration",
        },
        {
            icon: <ClipboardCheck className="w-12 h-12 text-orange-500"/>,
            title: "Inspection Tracking",
            description:
                "Comprehensive vehicle inspection checklists and reporting tools",
        },
        {
            icon: <BarChart3 className="w-12 h-12 text-orange-500"/>,
            title: "Analytics Dashboard",
            description:
                "Real-time insights into business performance and service metrics",
        },
        {
            icon: <Shield className="w-12 h-12 text-orange-500"/>,
            title: "Warranty Management",
            description: "Track and manage warranty claims and service guarantees",
        },
        {
            icon: <Clock className="w-12 h-12 text-orange-500"/>,
            title: "Real-time Updates",
            description:
                "Keep customers informed with automatic status updates and notifications",
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2 px-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4"/>
                            <span className="font-medium">+1 201 719 3488</span>
                        </div>
                        <div className="h-4 w-px bg-white/30"/>
                        <span className="text-white/90">Mon - Sat: 9am to 7pm</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex gap-4">
                            <Twitter className="w-4 h-4 cursor-pointer hover:text-white/80 transition-colors"/>
                            <Facebook className="w-4 h-4 cursor-pointer hover:text-white/80 transition-colors"/>
                            <Instagram className="w-4 h-4 cursor-pointer hover:text-white/80 transition-colors"/>
                            <Linkedin className="w-4 h-4 cursor-pointer hover:text-white/80 transition-colors"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
                    <div
                        className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                        AutoCare Hub
                    </div>
                    <div className="flex gap-12">
                        {["HOME", "SERVICES", "ABOUT", "CONTACT"].map((item) => (
                            <button
                                key={item}
                                className="text-sm font-medium hover:text-orange-500 transition-colors relative group"
                            >
                                {item}
                                <div
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform"/>
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <Button
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600 font-medium"
                            onClick={() => router.push("/signup")}
                        >
                            Sign Up
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-medium"
                            onClick={() => router.push("/login")}
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20"/>
                <div className="relative max-w-7xl mx-auto px-4 py-32">
                    <div className="max-w-3xl">
                        <h1 className="text-6xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Quality Garage Management Application
                        </h1>
                        <p className="mt-8 text-xl text-gray-300 leading-relaxed">
                            Streamline your garage operations with our comprehensive
                            management solution. Professional tools for modern automotive
                            businesses.
                        </p>
                        <div className="mt-12 flex gap-6">
                            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6">
                                Schedule Service
                                <ChevronRight className="ml-2 w-5 h-5"/>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white/80  hover:bg-white text-gray-900 hover:text-gray-500 text-lg px-8 py-6"
                            >
                                Find Center
                                <MapPin className="ml-2 w-5 h-5"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white py-16 relative">
                <div className="absolute inset-0 bg-orange-50 skew-y-3 transform origin-top-right"/>
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Schedule A Service Request
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            <Input placeholder="Full Name" className="h-12"/>
                            <Input placeholder="Email" className="h-12"/>
                            <div className="flex gap-4">
                                <Input placeholder="Phone" className="h-12 flex-1"/>
                                <Button className="bg-orange-500 hover:bg-orange-600 px-8 h-12">
                                    SEND
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-32 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900">
                            Everything you need to manage your garage
                        </h2>
                        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features to streamline your operations and improve
                            customer satisfaction
                        </p>
                    </div>

                    <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="border-none hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <CardHeader>
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-orange-100 rounded-2xl">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-semibold text-center mt-6">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-center text-lg">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-3 gap-16">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">About AutoCare Hub</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Professional vehicle management system for modern garage
                                operations. We help streamline your business and improve
                                customer satisfaction.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Contact Info</h3>
                            <div className="space-y-4 text-gray-400">
                                <p className="flex items-center gap-3 text-lg">
                                    <MapPin className="w-6 h-6 text-orange-500"/>
                                    72 Main Drive, Calibry, FL 89012
                                </p>
                                <p className="flex items-center gap-3 text-lg">
                                    <Phone className="w-6 h-6 text-orange-500"/>
                                    (+1) 201 719 3488
                                </p>
                                <p className="flex items-center gap-3 text-lg">
                                    <Mail className="w-6 h-6 text-orange-500"/>
                                    support@example.com
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Working Hours</h3>
                            <div className="text-gray-400 text-lg space-y-2">
                                <p>Monday - Friday: 9am to 7pm</p>
                                <p>Saturday: 10am to 5pm</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}