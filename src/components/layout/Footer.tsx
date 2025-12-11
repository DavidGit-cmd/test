import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import superiaLogo from "@/assets/superia-logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#11111f] text-white mt-auto">
      {/* Footer Content */}
      <div className="px-4 lg:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={superiaLogo} 
                  alt="Superia Cars Logo" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-sm text-gray-300">
                Skandinavias ledende bilforhandler med fokus på kvalitet, kundeservice og bærekraft.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Phone className="h-4 w-4" />
                  <span>+47 12 34 56 78</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span>kontakt@superiacars.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>Norge, Sverige, Danmark</span>
                </div>
              </div>
            </div>

            {/* Training Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Opplæring</h4>
              <div className="space-y-2">
                <Link 
                  to="/alle-ansatte" 
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  For alle ansatte
                </Link>
                <Link 
                  to="/innkjoper" 
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  For Innkjøpere
                </Link>
                <Link 
                  to="/selger" 
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  For Selgere
                </Link>
                <Link 
                  to="/klargjorer" 
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  For Klargjørere
                </Link>
                <Link 
                  to="/daglig-leder" 
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  For Daglige ledere
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Hurtiglenker</h4>
              <div className="space-y-2">
                <a 
                  href="https://superiacars.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <span>Hovedside</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="#" 
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Personalhåndbok
                </a>
                <a 
                  href="#" 
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  IT-support
                </a>
                <a 
                  href="#" 
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  HR-kontakt
                </a>
              </div>
            </div>

            {/* Company Stats */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Superia Cars</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-button-teal">2,500+</div>
                  <div className="text-sm text-gray-300">Ansatte</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-button-teal">#1</div>
                  <div className="text-sm text-gray-300">I Skandinavia</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-button-teal">50M+</div>
                  <div className="text-sm text-gray-300">NOK omsetning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 bg-[#0f0f1a]">
        <div className="px-4 lg:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-sm text-gray-300">
                Copyright © Superia Cars all rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}