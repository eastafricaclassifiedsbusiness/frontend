"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { profileService, settingsService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  jobAlerts: z.boolean(),
  applicationUpdates: z.boolean(),
  marketingEmails: z.boolean(),
})

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const { toast } = useToast()
  const { updateUser } = useAuth()

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      jobAlerts: true,
      applicationUpdates: true,
      marketingEmails: false,
    },
  })

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true)
    setPasswordError(null)
    
    try {
      console.log('Submitting password change form');
      
      if (values.newPassword !== values.confirmPassword) {
        setPasswordError("New passwords don't match");
        return;
      }

      const response = await settingsService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });

      // Update user data in auth context if provided
      if (response.user) {
        updateUser(response.user);
      }

      toast({
        title: "Success",
        description: "Password updated successfully",
      })
      
      // Reset form after successful password change
      passwordForm.reset()
    } catch (error: any) {
      console.error('Password change error:', error);
      setPasswordError(error.message || "Failed to update password");
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onNotificationSubmit(values: z.infer<typeof notificationSchema>) {
    setIsLoading(true)
    try {
      await settingsService.updateNotificationPreferences(values);
      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification preferences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        const preferences = await settingsService.getNotificationPreferences();
        notificationForm.reset(preferences);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load notification preferences",
          variant: "destructive",
        });
      }
    };

    fetchNotificationPreferences();
  }, [notificationForm, toast]);

  async function handleDeleteAccount() {
    setIsLoading(true)
    try {
      await profileService.deleteProfile()
      toast({
        title: "Success",
        description: "Account deleted successfully",
      })
      // Redirect to home page or login page
      window.location.href = "/"
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-6">
        {/* Password Change Section */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                {passwordError && (
                  <div className="text-sm text-red-500 mb-4">
                    {passwordError}
                  </div>
                )}
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          disabled={isLoading}
                          placeholder="Enter your current password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          disabled={isLoading}
                          placeholder="Enter your new password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          disabled={isLoading}
                          placeholder="Confirm your new password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Notification Preferences Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage your email notification settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
                <FormField
                  control={notificationForm.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Email Notifications</FormLabel>
                        <FormDescription>Receive important updates via email</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="jobAlerts"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Job Alerts</FormLabel>
                        <FormDescription>Get notified about new job opportunities</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="applicationUpdates"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Application Updates</FormLabel>
                        <FormDescription>Receive updates about your job applications</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Marketing Emails</FormLabel>
                        <FormDescription>Receive promotional offers and updates</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Account Deletion Section */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription>Permanently delete your account and all associated data</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading}>
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 