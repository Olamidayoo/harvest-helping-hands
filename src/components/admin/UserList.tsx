
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
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
    } catch (error: any) {
      toast({
        title: "Error updating admin status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4">
      {users.map((user: any) => (
        <Card key={user.id} className="glass">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-harvest-charcoal">
                  {user.username || 'Unnamed User'}
                </h3>
                <p className="text-sm text-harvest-charcoal/70">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant={user.is_admin ? "default" : "outline"}
                onClick={() => toggleAdmin(user.id, user.is_admin)}
              >
                {user.is_admin ? "Remove Admin" : "Make Admin"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserList;
