'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar, User } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  userType: string;
  phoneNumber: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && user?.userType !== 'admin') {
      router.replace('/');
    }
  }, [loading, user, router]);

  const fetchUsers = async () => {
    try {
      setFetching(true);
      const { data } = await api.get<User[]>('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user?.userType === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    return matchesSearch && matchesType;
  });

  if (loading || fetching) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by user type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="job-seeker">Job-seeker</SelectItem>
            <SelectItem value="Exporter">Exporter</SelectItem>
            <SelectItem value="Importer">Importer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <Badge variant={user.userType === 'admin' ? 'default' : 'secondary'}>
                  {user.userType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.phoneNumber && (
                  <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                )}
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 