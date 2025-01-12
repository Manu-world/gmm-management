import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  ShieldCheck,
  User,
  MessageSquare,
  HelpCircle,
  Sparkles
} from "lucide-react";
import emailjs from '@emailjs/browser';


export default function AdminContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    captcha: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    errorMessage: '',
    loading: false
  });

  const [captchaQuestion, setCaptchaQuestion] = useState(generateCaptchaQuestion());

  function generateCaptchaQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      question: `${num1} + ${num2} = ?`,
      answer: num1 + num2
    };
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading to true when submission starts
    setFormStatus(prev => ({ ...prev, loading: true }));

    // Comprehensive form validation
    if (!formData.name.trim()) {
      setFormStatus({ 
        submitted: false, 
        error: true, 
        errorMessage: 'Name is required' 
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormStatus({ 
        submitted: false, 
        error: true, 
        errorMessage: 'Please enter a valid email address' 
      });
      return;
    }

    if (!formData.message.trim()) {
      setFormStatus({ 
        submitted: false, 
        error: true, 
        errorMessage: 'Message is required' 
      });
      return;
    }

    // CAPTCHA validation
    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      setFormStatus({ 
        submitted: false, 
        error: true, 
        errorMessage: 'Incorrect CAPTCHA answer' 
      });
      return;
    }

    try {
      // EmailJS submission
      const result = await emailjs.send(
        'service_fzb643q',     // Replace with your EmailJS service ID
        'template_jrpgbxc',    // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message
        },
        'bOr9DR6ng53RZYYOA'      // Replace with your EmailJS public key
      );

      console.log('Email sent successfully:', result); // Log success
      // Success handling
      setFormStatus({ 
        submitted: true, 
        error: false, 
        errorMessage: '',
        loading: false
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
        captcha: '' // Reset captcha field
      });

      // Regenerate CAPTCHA
      setCaptchaQuestion(generateCaptchaQuestion());
    } catch (error) {
      console.error('Error sending email:', error); // Log error details
      // Error handling
      setFormStatus({ 
        submitted: false, 
        error: true, 
        errorMessage: 'Failed to send message. Please try again.',
        loading: false
      });
    }
  };

  // Function to validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-green-100/50 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-green-800 font-medium">We'd love to hear from you</span>
          </div>
          <h2 className="text-4xl font-bold text-green-800 tracking-tight">
            Get in Touch
          </h2>
          <p className="text-green-600 max-w-2xl mx-auto text-lg">
            Have questions or interested in joining us? Leave a message!
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100"
        >
          <div className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-green-50/30 hover:bg-green-50/50"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-green-50/30 hover:bg-green-50/50"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-green-50/30 hover:bg-green-50/50"
                  placeholder="Please describe your inquiry..."
                  required
                />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-orange-50/20 rounded-xl p-6 border border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Quick Verification</span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-green-800 font-semibold">{captchaQuestion.question}</span>
                    <div className="relative group">
                      <HelpCircle className="w-4 h-4 text-orange-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 
                                    hidden group-hover:block bg-white text-sm text-green-700 
                                    rounded-xl p-3 shadow-lg border border-green-100">
                        Please solve this simple math problem to verify you're human.
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleInputChange}
                    className="w-24 px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    placeholder="Answer"
                    required
                  />
                </div>
                {/* Visual indicator */}
                <div className="flex items-center space-x-2 text-sm text-gray-400 sm:ml-4">
                          <div className={`w-2 h-2 rounded-full ${
                            formData.captcha 
                              ? (parseInt(formData.captcha) === captchaQuestion.answer 
                                ? 'bg-green-500' 
                                : 'bg-red-500')
                              : 'bg-gray-600'
                          }`}></div>
                          <span className="hidden sm:inline">
                            {!formData.captcha 
                              ? 'Waiting for answer...'
                              : (parseInt(formData.captcha) === captchaQuestion.answer
                                ? 'Verified!'
                                : 'Try again')}
                          </span>
                        </div>
              </div>

              {formStatus.error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{formStatus.errorMessage}</span>
                </motion.div>
              )}

              {formStatus.submitted && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Message Received! The admin will attend to you ASAP.</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={formStatus.loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 
                         text-white font-medium py-4 px-6 rounded-xl
                         transition-all duration-200 flex items-center justify-center gap-3
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200
                         hover:shadow-xl hover:shadow-green-200 transform hover:-translate-y-0.5"
              >
                {formStatus.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}