'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { workoutsAPI } from '../../api/apiService';
import Button from '../../components/ui/Button';

interface Workout {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  exercises: any[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await workoutsAPI.getWorkouts();
        setWorkouts(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch workouts');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-4 sm:mt-0">
          <Link href="/workouts/create">
            <Button>Create Workout</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading your workouts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading workouts</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : workouts.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-3">No workouts yet</h3>
          <p className="text-gray-500 mb-6">Create your first workout to get started!</p>
          <Link href="/workouts/create">
            <Button>Create Your First Workout</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <Link href={`/workouts/${workout.id}`} key={workout.id} className="block">
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-medium text-gray-900 truncate">{workout.name}</h3>
                {workout.description && (
                  <p className="mt-1 text-gray-500 line-clamp-2">{workout.description}</p>
                )}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      {workout.exercises.length} {workout.exercises.length === 1 ? 'exercise' : 'exercises'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(workout.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 