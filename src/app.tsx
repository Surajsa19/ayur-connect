import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home, Calendar, PlusCircle, User, Clock, CheckCircle, Bell, Users, Activity, Brain, Settings, BarChart3, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Checkbox } from './components/ui/checkbox';
import { Textarea } from './components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';

type ViewType = 'login' | 'onboarding' | 'patient' | 'practitioner';
type PatientView = 'dashboard' | 'schedule' | 'feedback' | 'profile';
type PractitionerView = 'dashboard' | 'patients' | 'schedule' | 'ai-assistant' | 'analytics';

interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  currentDay: number;
  totalDays: number;
  recentFeedback: string;
  avatar: string;
}

interface Therapy {
  id: string;
  name: string;
  time: string;
  description: string;
  date: string;
  completed: boolean;
  type: 'upcoming' | 'today' | 'past';
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [patientView, setPatientView] = useState<PatientView>('dashboard');
  const [practitionerView, setPractitionerView] = useState<PractitionerView>('dashboard');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userType, setUserType] = useState<'patient' | 'practitioner'>('patient');
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState<Therapy | null>(null);

  // Mock data
  const currentPatient = {
    name: 'Anjali Sharma',
    currentDay: 7,
    totalDays: 21,
    nextTherapy: 'Virechana (Purgation Therapy)',
    nextTime: '2:00 PM'
  };

  const therapies: Therapy[] = [
    { id: '1', name: 'Abhyanga (Oil Massage)', time: '9:00 AM', description: 'Full body oil massage with warm herbal oils', date: 'Today', completed: true, type: 'past' },
    { id: '2', name: 'Virechana (Purgation Therapy)', time: '2:00 PM', description: 'Therapeutic purification process', date: 'Today', completed: false, type: 'today' },
    { id: '3', name: 'Shirodhara (Oil Pouring)', time: '10:00 AM', description: 'Continuous pouring of oil on forehead', date: 'Tomorrow', completed: false, type: 'upcoming' }
  ];

  const patients: Patient[] = [
    { id: '1', name: 'Anjali Sharma', age: 34, diagnosis: 'Stress & Anxiety', currentDay: 7, totalDays: 21, recentFeedback: 'Severe Nausea', avatar: '/api/placeholder/40/40' },
    { id: '2', name: 'Rajesh Kumar', age: 45, diagnosis: 'Digestive Issues', currentDay: 14, totalDays: 21, recentFeedback: 'Feeling Great', avatar: '/api/placeholder/40/40' },
    { id: '3', name: 'Priya Patel', age: 28, diagnosis: 'Chronic Fatigue', currentDay: 3, totalDays: 21, recentFeedback: 'Mild Improvement', avatar: '/api/placeholder/40/40' }
  ];

  const onboardingSlides = [
    {
      title: "Welcome to Your Healing Journey",
      description: "Ayur-Connect is your personal companion for a seamless Panchakarma experience.",
      icon: <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center"><User className="w-16 h-16 text-primary" /></div>
    },
    {
      title: "Stay on Track, Effortlessly",
      description: "Receive personalized schedules and timely reminders for your therapies, diet, and lifestyle.",
      icon: <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center"><Calendar className="w-16 h-16 text-primary" /></div>
    },
    {
      title: "Your Feedback Matters",
      description: "Share how you're feeling after each session to help your practitioner tailor your treatment.",
      icon: <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center"><Activity className="w-16 h-16 text-primary" /></div>
    }
  ];

  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900">Welcome to Ayur-Connect</CardTitle>
              <CardDescription className="text-gray-600 mt-2">Your journey to wellness begins here</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full h-12 text-base font-medium" onClick={() => {setCurrentView('onboarding'); setUserType('patient')}}>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full h-12 text-base font-medium" onClick={() => {setCurrentView('onboarding'); setUserType('patient')}}>
              Continue with Apple
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-12 text-base font-medium" onClick={() => {setCurrentView('onboarding'); setUserType('patient')}}>
              📱 Continue with Phone
            </Button>
            <div className="text-center pt-4 space-y-2">
              <p className="text-sm text-gray-600">New User? <button className="text-primary font-medium hover:underline" onClick={() => {setCurrentView('onboarding'); setUserType('patient')}}>Register Here</button></p>
              <p className="text-sm text-gray-600">Healthcare Provider? <button className="text-primary font-medium hover:underline" onClick={() => {setCurrentView('practitioner'); setPractitionerView('dashboard')}}>Portal Access</button></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const OnboardingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {onboardingSlides[onboardingStep].icon}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{onboardingSlides[onboardingStep].title}</h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">{onboardingSlides[onboardingStep].description}</p>
            
            <div className="flex justify-center space-x-2 mb-8">
              {onboardingSlides.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full ${index === onboardingStep ? 'bg-primary' : 'bg-gray-200'}`} />
              ))}
            </div>

            {onboardingStep < onboardingSlides.length - 1 ? (
              <Button onClick={() => setOnboardingStep(onboardingStep + 1)} className="w-full h-12 text-base font-medium">
                Continue
              </Button>
            ) : (
              <Button onClick={() => setCurrentView('patient')} className="w-full h-12 text-base font-medium">
                Let's Get Started
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const PatientDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Hello, {currentPatient.name}! 👋</h1>
        <Bell className="w-6 h-6 text-gray-400" />
      </div>

      {/* Today's Focus Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">Today's Focus</h3>
              <p className="text-2xl font-semibold mb-1">{currentPatient.nextTherapy}</p>
              <div className="flex items-center text-white/90">
                <Clock className="w-4 h-4 mr-2" />
                <span>at {currentPatient.nextTime}</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Your 21-Day Panchakarma Journey</h3>
            <Badge variant="secondary">Day {currentPatient.currentDay} of {currentPatient.totalDays}</Badge>
          </div>
          <Progress value={(currentPatient.currentDay / currentPatient.totalDays) * 100} className="h-3 mb-4" />
          <p className="text-sm text-gray-600">You're doing great! Keep following your personalized treatment plan.</p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => setFeedbackModal(true)} className="h-16 flex-col space-y-2" size="lg">
          <PlusCircle className="w-6 h-6" />
          <span>Log Today's Feedback</span>
        </Button>
        <Button onClick={() => setPatientView('schedule')} variant="outline" className="h-16 flex-col space-y-2" size="lg">
          <Calendar className="w-6 h-6" />
          <span>View Full Schedule</span>
        </Button>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Guidance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2" />
            <p className="text-sm text-gray-700">Reminder: Please have a light, liquid breakfast this morning.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <p className="text-sm text-gray-700">Your next therapy session is in 2 hours. Please arrive 15 minutes early.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PatientSchedule = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => setPatientView('dashboard')}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Your Schedule</h1>
      </div>

      <div className="space-y-4">
        {therapies.map((therapy) => (
          <Card 
            key={therapy.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              therapy.completed ? 'opacity-60' : ''
            } ${therapy.type === 'today' ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
            onClick={() => {setSelectedTherapy(therapy); setRescheduleModal(true);}}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {therapy.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Clock className="w-6 h-6 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{therapy.name}</h3>
                    <p className="text-sm text-gray-600">{therapy.time} • {therapy.date}</p>
                  </div>
                </div>
                <Badge variant={therapy.type === 'today' ? 'default' : 'secondary'}>
                  {therapy.type}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2 ml-9">{therapy.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const PatientProfile = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/api/placeholder/80/80" />
              <AvatarFallback className="text-xl bg-primary text-white">AS</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{currentPatient.name}</h2>
              <p className="text-gray-600">Patient ID: #12345</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>My Progress</CardTitle>
          <CardDescription>Your wellness journey over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-center space-x-2">
            {[3, 4, 3, 5, 4, 5, 4].map((height, index) => (
              <div key={index} className={`bg-primary/20 w-8 rounded-t`} style={{height: `${height * 20}%`}} />
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center mt-4">Overall feeling trend (1-5 scale)</p>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Milestones Unlocked</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-green-700">7 Days Complete!</p>
              <p className="text-sm text-green-600">Great progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-blue-700">First Feedback!</p>
              <p className="text-sm text-blue-600">Communication started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PractitionerDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ayurveda Wellness Clinic Dashboard</h1>
        <p className="text-gray-600">Dr. Sonal Mehta</p>
      </div>

      {/* Urgent Alerts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-700 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Immediate Attention: Patient Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patients.filter(p => p.recentFeedback.includes('Severe')).map((patient) => (
            <div key={patient.id} className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-red-100 text-red-700">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <p className="text-sm text-red-600">Reported: {patient.recentFeedback}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                Review
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {therapies.slice(0, 3).map((therapy) => (
              <div key={therapy.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{therapy.name}</p>
                  <p className="text-sm text-gray-600">{therapy.time}</p>
                </div>
                <Badge variant={therapy.completed ? 'secondary' : 'default'}>
                  {therapy.completed ? 'Completed' : 'Scheduled'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                  <p className="text-sm text-gray-600">Total Patients Today</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">8</p>
                  <p className="text-sm text-gray-600">Therapies Completed</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">85%</p>
                  <p className="text-sm text-gray-600">Clinic Resource Occupancy</p>
                </div>
                <BarChart3 className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const PractitionerPatients = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Patient Management</h1>

      <div className="grid gap-4">
        {patients.map((patient) => (
          <Card key={patient.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Age {patient.age} • {patient.diagnosis}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Day {patient.currentDay}/{patient.totalDays}
                      </Badge>
                      <Progress value={(patient.currentDay / patient.totalDays) * 100} className="h-1 w-20" />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Recent Feedback</p>
                  <p className={`text-sm ${patient.recentFeedback.includes('Severe') ? 'text-red-600' : patient.recentFeedback.includes('Great') ? 'text-green-600' : 'text-gray-600'}`}>
                    {patient.recentFeedback}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const PractitionerAI = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">AI Scheduling Assistant</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-primary" />
            Create New Panchakarma Plan
          </CardTitle>
          <CardDescription>Let AI help you design the optimal treatment plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Patient Selection</label>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="font-medium">Select Patient</p>
                  <p className="text-sm text-gray-600">Choose from existing patients</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Primary Diagnosis</label>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="font-medium">Stress & Digestive Issues</p>
                  <p className="text-sm text-gray-600">AI will optimize based on condition</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Therapy Protocol</label>
                <div className="space-y-2">
                  {['Vamana (Emesis)', 'Virechana (Purgation)', 'Basti (Enema)', 'Nasya (Nasal)'].map((therapy) => (
                    <div key={therapy} className="flex items-center space-x-2">
                      <Checkbox id={therapy} />
                      <label htmlFor={therapy} className="text-sm text-gray-700">{therapy}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Duration</label>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="font-medium">21 Days</p>
                  <p className="text-sm text-gray-600">Standard Panchakarma cycle</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button className="w-full md:w-auto" size="lg">
              <Brain className="w-5 h-5 mr-2" />
              Generate AI-Optimized Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              🤖 <strong>AI Insight:</strong> Based on current patient load and resource availability, 
              starting the treatment plan on Monday would provide optimal therapist allocation and facility usage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FeedbackModal = () => (
    <Dialog open={feedbackModal} onOpenChange={setFeedbackModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How are you feeling after your session?</DialogTitle>
          <DialogDescription>Your feedback helps us provide better care</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-center space-x-4">
            {['😞', '😐', '🙂', '😊', '😍'].map((emoji, index) => (
              <button key={index} className="text-4xl hover:scale-110 transition-transform p-2 rounded-full hover:bg-gray-100">
                {emoji}
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Symptoms (check all that apply)</label>
            <div className="grid grid-cols-2 gap-2">
              {['Headache', 'Nausea', 'Fatigue', 'Bloating', 'Energetic', 'Calm'].map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox id={symptom} />
                  <label htmlFor={symptom} className="text-sm text-gray-700">{symptom}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Notes</label>
            <Textarea placeholder="Anything else you'd like to share?" />
          </div>

          <Button onClick={() => setFeedbackModal(false)} className="w-full">
            Submit Feedback to My Practitioner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const RescheduleModal = () => (
    <Dialog open={rescheduleModal} onOpenChange={setRescheduleModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{selectedTherapy?.name}</DialogTitle>
          <DialogDescription>Therapy Details & Options</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Description</TabsTrigger>
            <TabsTrigger value="pre">Pre-care</TabsTrigger>
            <TabsTrigger value="post">Post-care</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <p className="text-sm text-gray-700">{selectedTherapy?.description}</p>
            <div className="space-y-2">
              <p className="text-sm"><strong>Time:</strong> {selectedTherapy?.time}</p>
              <p className="text-sm"><strong>Date:</strong> {selectedTherapy?.date}</p>
            </div>
          </TabsContent>
          <TabsContent value="pre" className="space-y-4">
            <div className="text-sm text-gray-700 space-y-2">
              <p>• Light breakfast recommended</p>
              <p>• Avoid heavy physical activity</p>
              <p>• Arrive 15 minutes early</p>
              <p>• Wear comfortable clothing</p>
            </div>
          </TabsContent>
          <TabsContent value="post" className="space-y-4">
            <div className="text-sm text-gray-700 space-y-2">
              <p>• Rest for 30 minutes after treatment</p>
              <p>• Drink warm water</p>
              <p>• Avoid cold foods and drinks</p>
              <p>• Monitor any reactions</p>
            </div>
          </TabsContent>
        </Tabs>
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={() => setRescheduleModal(false)}>
            Request to Reschedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const PatientBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
      <div className="flex justify-around">
        {[
          { view: 'dashboard', icon: Home, label: 'Home' },
          { view: 'schedule', icon: Calendar, label: 'Schedule' },
          { view: 'feedback', icon: PlusCircle, label: 'Feedback' },
          { view: 'profile', icon: User, label: 'Profile' }
        ].map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            onClick={() => setPatientView(view as PatientView)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              patientView === view ? 'text-primary bg-primary/10' : 'text-gray-600'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const PractitionerSidebar = () => (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Ayur-Connect</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {[
              { view: 'dashboard', icon: Home, label: 'Dashboard' },
              { view: 'patients', icon: Users, label: 'Patients' },
              { view: 'schedule', icon: Calendar, label: 'Schedule' },
              { view: 'ai-assistant', icon: Brain, label: 'AI Assistant' },
              { view: 'analytics', icon: BarChart3, label: 'Analytics' }
            ].map(({ view, icon: Icon, label }) => (
              <button
                key={view}
                onClick={() => setPractitionerView(view as PractitionerView)}
                className={`group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  practitionerView === view 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-white">SM</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Dr. Sonal Mehta</p>
              <p className="text-xs text-gray-500">Ayurveda Specialist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientView = () => {
    switch (patientView) {
      case 'dashboard':
        return <PatientDashboard />;
      case 'schedule':
        return <PatientSchedule />;
      case 'profile':
        return <PatientProfile />;
      default:
        return <PatientDashboard />;
    }
  };

  const renderPractitionerView = () => {
    switch (practitionerView) {
      case 'dashboard':
        return <PractitionerDashboard />;
      case 'patients':
        return <PractitionerPatients />;
      case 'ai-assistant':
        return <PractitionerAI />;
      default:
        return <PractitionerDashboard />;
    }
  };

  if (currentView === 'login') {
    return <LoginScreen />;
  }

  if (currentView === 'onboarding') {
    return <OnboardingScreen />;
  }

  if (currentView === 'patient') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative pb-20 md:pb-0">
          <div className="p-6">
            {renderPatientView()}
          </div>
          <PatientBottomNav />
        </div>
        <FeedbackModal />
        <RescheduleModal />
      </div>
    );
  }

  if (currentView === 'practitioner') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PractitionerSidebar />
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                {renderPractitionerView()}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return null;
};

export default App;