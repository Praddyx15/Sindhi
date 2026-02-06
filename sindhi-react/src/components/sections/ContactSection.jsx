import React from 'react';
import { MapPin, Instagram, Clock, Phone } from 'lucide-react';

const ContactSection = () => {
    return (
        <section id="contact" className="py-24 bg-bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-3">
                        Get in Touch
                    </span>
                    <h2 className="font-display text-4xl font-bold text-neutral-900 mb-4">
                        Visit Our Store
                    </h2>
                    <p className="text-neutral-500 max-w-2xl mx-auto">
                        We'd love to serve you the finest snacks and dry fruits in person.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Address Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover hover:translate-x-1 transition-all duration-300 flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-display font-semibold text-neutral-900 mb-2">Store Address</h4>
                                <p className="text-neutral-600 text-sm leading-relaxed">Shop No. C-11, G3 Qutub Plaza<br />DLF Phase-1, Gurugram</p>
                            </div>
                        </div>

                        {/* Social Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover hover:translate-x-1 transition-all duration-300 flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                <Instagram className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-display font-semibold text-neutral-900 mb-2">Follow Us</h4>
                                <a
                                    href="https://www.instagram.com/sindhi_namkeen_dry_fruits_/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-600 font-medium text-sm flex items-center gap-1 transition-colors"
                                >
                                    @sindhi_namkeen_dry_fruits_
                                </a>
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover hover:translate-x-1 transition-all duration-300 flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-display font-semibold text-neutral-900 mb-2">Store Hours</h4>
                                <p className="text-neutral-600 text-sm mb-1">Mon - Sat: 10 AM - 9 PM</p>
                                <p className="text-neutral-600 text-sm">Sunday: 11 AM - 8 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Google Map */}
                    <div className="lg:col-span-3 h-[500px] bg-white rounded-2xl shadow-card overflow-hidden border border-neutral-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2233913121413!2d77.0897!3d28.4697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193e3b989e6b%3A0x7d7c1cc7e0e2e8b!2sQutub%20Plaza%2C%20DLF%20Phase%201%2C%20Sector%2028%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1705762000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Sindhi Namkeen Location"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
