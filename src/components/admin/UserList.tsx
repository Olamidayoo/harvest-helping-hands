import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, User, Check, X, Mail, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('table'); // 'table' or 'grid'
  const [filter, setFilter] = useState('all'); // 'all', 'admin', 'regular'
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      let query = supabase.from('profiles').select('*');
      
      if (filter === 'admin') {
        query = query.eq('is_admin', true);
      } else if (filter === 'regular') {
        query = query.eq('is_admin', false);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched users:", data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Admin status updated",
        description: "User's admin status has been updated successfully"
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Error updating admin status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower))
    );
  });

  const getInitials = (username) => {
    if (!username) return '?';
    return username.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-harvest-sage"></div>
        <span className="ml-2 text-harvest-sage">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-harvest-charcoal mb-1">User Management</h2>
          <p className="text-harvest-charcoal/70 text-sm">View and manage all users</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-harvest-charcoal/40" />
            <Input 
              placeholder="Search users..." 
              className="pl-8 bg-white/50 border-harvest-sage/30 focus:border-harvest-sage" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[160px] bg-white/50 border-harvest-sage/30">
              <Filter className="h-4 w-4 mr-2 opacity-70" />
              <SelectValue placeholder="Filter users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="admin">Admins Only</SelectItem>
              <SelectItem value="regular">Regular Users</SelectItem>
            </SelectContent>
          </Select>

          <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value)}>
            <ToggleGroupItem value="table" aria-label="Table view">
              Table
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              Grid
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <p className="text-harvest-charcoal/70">No users found.</p>
          </CardContent>
        </Card>
      ) : viewType === 'table' ? (
        <Card className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-harvest-sage/10">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Admin Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-harvest-sage/5">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-harvest-sage/30">
                          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.username || 'Unnamed User'}</div>
                          {user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200 border">
                          <Check className="w-3 h-3 mr-1" /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-harvest-charcoal/70">
                          <X className="w-3 h-3 mr-1" /> Regular User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={user.is_admin ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                        className={cn(
                          user.is_admin ? "bg-red-100 text-red-800 hover:bg-red-200" : "bg-harvest-sage text-white hover:bg-harvest-sage/90"
                        )}
                      >
                        {user.is_admin ? "Remove Admin" : "Make Admin"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="glass overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-harvest-sage/30 to-harvest-sage/10 p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 bg-white/70 border-2 border-white/50 ring-2 ring-harvest-sage/20">
                      <AvatarFallback className="text-xl">{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-harvest-charcoal truncate">
                        {user.username || 'Unnamed User'}
                      </h3>
                      <div className="flex items-center text-sm text-harvest-charcoal/70">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        Joined {formatDate(user.created_at)}
                      </div>
                      {user.email && (
                        <div className="flex items-center text-sm text-harvest-charcoal/70">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      )}
                    </div>
                    {user.is_admin && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 border">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-4 flex justify-between items-center">
                  <Button
                    variant={user.is_admin ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleAdmin(user.id, user.is_admin)}
                    className={cn(
                      "w-full",
                      user.is_admin ? "bg-red-100 text-red-800 hover:bg-red-200" : "bg-harvest-sage text-white hover:bg-harvest-sage/90"
                    )}
                  >
                    {user.is_admin ? "Remove Admin" : "Make Admin"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-harvest-sage/10">
        <p className="text-sm text-harvest-charcoal/70">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>
    </div>
  );
};

export default UserList;
