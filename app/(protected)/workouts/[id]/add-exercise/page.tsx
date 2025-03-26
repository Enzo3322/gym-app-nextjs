'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { workoutsAPI, exercisesAPI } from '../../../../api/apiService';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
}

interface WorkoutExerciseFormData {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
  notes?: string;
}

export default function AddExerciseToWorkoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutExerciseFormData>({
    defaultValues: {
      sets: 3,
      reps: 10,
    },
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exercisesAPI.getExercises();
        setExercises(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const onSubmit = async (data: WorkoutExerciseFormData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      await workoutsAPI.addExerciseToWorkout(params.id, data);
      router.push(`/workouts/${params.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add exercise to workout');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600">Loading exercises...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Exercise to Workout</h1>
        <p className="mt-2 text-gray-600">
          Select an exercise and enter the details.
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
            <label htmlFor="exerciseId" className="block text-sm font-medium text-gray-700 mb-1">
              Exercise
            </label>
            <select
              id="exerciseId"
              className="w-full text-black p-2 rounded-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
              {...register('exerciseId', { required: 'Please select an exercise' })}
            >
              <option value="">Select an exercise</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name} ({exercise.muscleGroup})
                </option>
              ))}
            </select>
            {errors.exerciseId && (
              <p className="mt-1 text-sm text-red-600">{errors.exerciseId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Input
                id="sets"
                label="Sets"
                type="number"
                fullWidth
                min={1}
                error={errors.sets?.message}
                {...register('sets', { 
                  required: 'Sets is required',
                  min: { value: 1, message: 'Minimum 1 set' },
                  valueAsNumber: true,
                })}
              />
            </div>

            <div>
              <Input
                id="reps"
                label="Reps"
                type="number"
                fullWidth
                min={1}
                error={errors.reps?.message}
                {...register('reps', { 
                  required: 'Reps is required',
                  min: { value: 1, message: 'Minimum 1 rep' },
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Input
                id="weight"
                label="Weight (kg)"
                type="number"
                fullWidth
                step="0.5"
                min={0}
                error={errors.weight?.message}
                {...register('weight', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Weight cannot be negative' },
                })}
              />
            </div>

            <div>
              <Input
                id="restTime"
                label="Rest Time (seconds)"
                type="number"
                fullWidth
                min={0}
                error={errors.restTime?.message}
                {...register('restTime', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Rest time cannot be negative' },
                })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              className="w-full text-black p-2 rounded-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
              {...register('notes')}
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
              isLoading={submitting}
            >
              Add Exercise
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 