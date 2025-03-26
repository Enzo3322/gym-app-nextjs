'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { exercisesAPI } from '../../api/apiService';
import Button from '../../components/ui/Button';

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  createdAt: string;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exercisesAPI.getExercises();
        setExercises(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const muscleGroups = [...new Set(exercises.map(ex => ex.muscleGroup))];

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

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading exercises</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Exercises</h1>
        <div className="mt-4 sm:mt-0">
          <Link href="/exercises/create">
            <Button>Create Exercise</Button>
          </Link>
        </div>
      </div>

      {exercises.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-3">No exercises yet</h3>
          <p className="text-gray-500 mb-6">Start by adding some exercises to your library.</p>
          <Link href="/exercises/create">
            <Button>Create Your First Exercise</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {muscleGroups.map(group => (
            <div key={group} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">{group}</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {exercises
                  .filter(ex => ex.muscleGroup === group)
                  .map(exercise => (
                    <li key={exercise.id} className="px-6 py-4 hover:bg-gray-50">
                      <Link href={`/exercises/${exercise.id}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">{exercise.name}</h3>
                            {exercise.description && (
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {exercise.description}
                              </p>
                            )}
                          </div>
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 