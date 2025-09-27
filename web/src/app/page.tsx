import Link from "next/link";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            GroupSafe
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A lightweight control layer for shared cryptocurrency treasuries. 
            Make everyday payments fast and safe while maintaining security through policy enforcement.
          </p>
          <Link
            href="/payments"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
          >
            Start Making Payments
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Policy Enforcement
            </h3>
            <p className="text-gray-600">
              Automatic validation of per-member budgets, recipient allowlists, 
              and escalation rules for secure treasury management.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Fast Execution
            </h3>
            <p className="text-gray-600">
              Routine, in-policy actions execute immediately while larger 
              transactions are automatically queued for multisig approval.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Team Collaboration
            </h3>
            <p className="text-gray-600">
              Role-based permissions, session keys, and comprehensive 
              audit trails for transparent team treasury operations.
            </p>
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">The Problem</h2>
              <p className="text-gray-600 mb-4">
                Most shared wallets give teams only coarse controls: either every action 
                needs multisig (slow) or too much power is centralized (risky).
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• No role-based budgets</li>
                <li>• No recipient restrictions</li>
                <li>• No time-bound caps</li>
                <li>• No automatic escalation</li>
                <li>• Fragile, error-prone operations</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Our Solution</h2>
              <p className="text-gray-600 mb-4">
                GroupSafe integrates Gnosis Safe with policy modules that enforce 
                rules on-chain and provide a clean frontend for transparent operations.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Policy-based automation</li>
                <li>• Role-based permissions</li>
                <li>• Automatic escalation</li>
                <li>• Complete audit trails</li>
                <li>• Gasless UX with session keys</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Treasury?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start making secure, policy-enforced payments today.
          </p>
          <Link
            href="/payments"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
          >
            Get Started with Payments
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}