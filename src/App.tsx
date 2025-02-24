import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeBanner } from './components/WelcomeBanner';
import { CompanyCard } from './components/CompanyCard';
import { Modal } from './components/Modal';
import { JoinModal } from './components/JoinModal';
import { WorkPermitModal } from './components/WorkPermitModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { supabase } from './lib/supabase';
import { initializeDatabase } from './lib/initSupabase';
import { UserCircle2 } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
  working_hours: string;
}

interface User {
  id: string; // Changed from number to string for UUID
  username: string;
  full_name: string;
  email: string;
}

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showWorkPermitModal, setShowWorkPermitModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserCompanies();
    } else {
      setCompanies([]);
      setIsLoading(false); // Set loading to false when there's no user
    }
  }, [currentUser]);

  const fetchUserCompanies = async () => {
    if (!currentUser) return;
    
    try {
      const { data: userCompanies, error: userCompaniesError } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', currentUser.id);

      if (userCompaniesError) throw userCompaniesError;

      const companyIds = userCompanies.map(uc => uc.company_id);

      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .in('id', companyIds);

      if (companiesError) throw companiesError;
      setCompanies(companies || []);
    } catch (error) {
      console.error('Error fetching user companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', loginCredentials.username)
        .eq('password', loginCredentials.password)
        .single();

      if (error) throw error;

      if (users) {
        setCurrentUser(users);
        setShowLoginModal(false);
        setLoginCredentials({ username: '', password: '' });
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCompanies([]);
  };

  const handleJoin = (companyName: string) => {
    setSelectedCompany(companyName);
    setShowJoinModal(true);
  };

  const handleApplyNow = () => {
    setShowJoinModal(false);
    setShowWorkPermitModal(true);
  };

  const handleComplete = () => {
    setShowWorkPermitModal(false);
  };

  if (isAdmin) {
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowAdminModal(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Admin Login"
        >
          <UserCircle2 className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <Header 
        userName={currentUser?.full_name || 'Guest'} 
        isLoggedIn={!!currentUser}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner />

        {!currentUser ? (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Log in to View Available Opportunities
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Congratulations on Your Qualification! 🎉</h2>
              <p className="text-lg text-gray-600">
                You have qualified to join these prestigious Canadian companies. Select which company you would prefer to work for and click "Join" to proceed with your application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  {...company}
                  onJoin={() => handleJoin(company.name)}
                />
              ))}
              {companies.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">
                    You don't have any companies assigned to you yet.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Login to View Opportunities</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={loginCredentials.username}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Login
            </button>
          </form>
        </div>
      </Modal>

      <Modal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)}>
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Login</h2>
          <AdminLogin onLogin={() => {
            setIsAdmin(true);
            setShowAdminModal(false);
          }} />
        </div>
      </Modal>

      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)}>
        <JoinModal
          companyName={selectedCompany || ''}
          onApplyNow={handleApplyNow}
        />
      </Modal>

      <Modal isOpen={showWorkPermitModal} onClose={() => setShowWorkPermitModal(false)}>
        <WorkPermitModal onComplete={handleComplete} />
      </Modal>
    </div>
  );
}

export default App;