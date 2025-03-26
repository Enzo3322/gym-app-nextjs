'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { exercisesAPI } from '../../../api/apiService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export interface ExerciseFormData {
  name: string;
  description: string;
  muscleGroup: string;
}

const muscleGroups = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Full Body',
  'Cardio',
];

export default function CreateExercisePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseFormData>();

  const onSubmit = async (data: ExerciseFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await exercisesAPI.createExercise(data);
      router.push('/exercises');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Exercise</h1>
        <p className="mt-2 text-gray-600">
          Add a new exercise to your collection.
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
              label="Exercise Name"
              type="text"
              fullWidth
              placeholder="e.g., Bench Press"
              error={errors.name?.message}
              {...register('name', { required: 'Exercise name is required' })}
            />
          </div>

          <div>
            <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Muscle Group
            </label>
            <select
              id="muscleGroup"
              className="w-full text-black p-2 rounded-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
              {...register('muscleGroup', { required: 'Muscle group is required' })}
            >
              <option value="">Select a muscle group</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.muscleGroup && (
              <p className="mt-1 text-sm text-red-600">{errors.muscleGroup.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              placeholder="Describe how to perform the exercise correctly"
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
              Create Exercise
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 