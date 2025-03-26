'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { workoutsAPI } from '../../../../api/apiService';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface WorkoutFormData {
  name: string;
  description: string;
}

export default function EditWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const workoutId = resolvedParams.id;
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkoutFormData>();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setIsFetching(true);
        const workout = await workoutsAPI.getWorkout(workoutId);
        reset({
          name: workout.name,
          description: workout.description || '',
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchWorkout();
  }, [workoutId, reset]);

  const onSubmit = async (data: WorkoutFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await workoutsAPI.updateWorkout(workoutId, data);
      router.push(`/workouts/${workoutId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="text-center py-10">
        <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600">Loading workout details...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Workout</h1>
        <p className="mt-2 text-gray-600">
          Update your workout program information.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              id="name"
              label="Workout Name"
              type="text"
              fullWidth
              placeholder="e.g., Monday Upper Body"
              error={errors.name?.message}
              {...register('name', { required: 'Workout name is required' })}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              placeholder="Describe your workout program"
              rows={4}
              className="w-full text-black p-2 rounded-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
              {...register('description')}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading}
            >
              Update Workout
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 