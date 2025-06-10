'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Phase 1
    userType: '',
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    // Phase 2
    gender: '',
    country: '',
    state: '',
    city: '',
    dateOfBirth: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const { register, error, sendOTP, verifyOTP } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setResumeError('Please upload a PDF file');
        setResume(null);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setResumeError('File size should be less than 5MB');
        setResume(null);
        return;
      }

      setResumeError(null);
      setResume(file);
    }
  };

  const handleSendOTP = async () => {
    try {
      await sendOTP(formData.email);
      setOtpSent(true);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(formData.email, otp);
      setOtpVerified(true);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate Phase 1 fields
      if (!formData.userType || !formData.name || !formData.email || 
          !formData.phoneNumber || !formData.password || !formData.confirmPassword) {
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      if (!otpVerified) {
        return;
      }
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append resume if exists
      if (resume) {
        formDataToSend.append('resume', resume);
      }

      await register(formDataToSend);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
        <Progress value={step === 1 ? 50 : 100} className="mt-2" />
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="grid w-full items-center gap-4">
            {step === 1 ? (
              // Phase 1: Basic Information
              <>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="userType">User Type</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => handleSelectChange('userType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job-seeker">Job Seeker</SelectItem>
                      <SelectItem value="exporter">Exporter</SelectItem>
                      <SelectItem value="importer">Importer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Button 
                      type="button" 
                      onClick={handleSendOTP}
                      disabled={!formData.email || otpSent}
                    >
                      {otpSent ? 'Sent' : 'Send OTP'}
                    </Button>
                  </div>
                </div>
                {otpSent && !otpVerified && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <div className="flex gap-2">
                      <Input
                        id="otp"
                        name="otp"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <Button 
                        type="button" 
                        onClick={handleVerifyOTP}
                        disabled={!otp}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            ) : (
              // Phase 2: Personal Details
              <>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Enter your country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="Enter your state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
                {formData.userType === 'job-seeker' && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="resume">Resume (PDF only, max 5MB)</Label>
                    <Input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeChange}
                      className="cursor-pointer"
                      required
                    />
                    {resumeError && (
                      <p className="text-sm text-red-500">{resumeError}</p>
                    )}
                    {resume && (
                      <p className="text-sm text-green-500">
                        Selected file: {resume.name}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === 2 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(1)}
            >
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button 
              type="button" 
              onClick={handleNextStep}
              disabled={!formData.userType || !formData.name || !formData.email || 
                       !formData.phoneNumber || !formData.password || 
                       !formData.confirmPassword || !otpVerified}
            >
              Next
            </Button>
          ) : (
            <Button type="submit">
              Register
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
} 