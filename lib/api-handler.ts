// lib/api-handler.ts
// Unified API error handling and response formatting

import { NextResponse } from 'next/server';
import { ValidationError } from './validation';
import { Prisma } from '@prisma/client';

export type ApiError = {
  error: string;
  field?: string;
  code?: string;
  details?: any;
};

export type ApiSuccess<T = any> = {
  data: T;
  message?: string;
};

// Error handler that maps errors to appropriate HTTP responses
export function handleApiError(error: unknown): NextResponse<ApiError> {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[API_ERROR]', error);
  }

  // Validation errors (400 Bad Request)
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        field: error.field,
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      const field = (error.meta?.target as string[])?.[0] || 'field';
      return NextResponse.json(
        {
          error: `A record with this ${field} already exists`,
          field,
          code: 'DUPLICATE_ENTRY',
        },
        { status: 409 }
      );
    }

    // Foreign key constraint violation
    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          error: 'Referenced record does not exist',
          code: 'INVALID_REFERENCE',
        },
        { status: 400 }
      );
    }

    // Record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          error: 'Record not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Generic Prisma error
    return NextResponse.json(
      {
        error: 'Database error',
        code: 'DATABASE_ERROR',
        ...(process.env.NODE_ENV === 'development' && { details: error.message }),
      },
      { status: 500 }
    );
  }

  // Prisma client initialization error
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      {
        error: 'Database connection failed',
        code: 'DB_CONNECTION_ERROR',
      },
      { status: 503 }
    );
  }

  // Standard errors
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes('Unauthorized') || error.message.includes('unauthorized')) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    if (error.message.includes('Forbidden') || error.message.includes('forbidden')) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'production' 
          ? 'An error occurred' 
          : error.message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }

  // Unknown error type
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
}

// Success response helper
export function apiSuccess<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      data,
      ...(message && { message }),
    },
    { status }
  );
}

// Created response helper (201)
export function apiCreated<T>(data: T, message = 'Resource created'): NextResponse<ApiSuccess<T>> {
  return apiSuccess(data, message, 201);
}

// No content response helper (204)
export function apiNoContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// Unauthorized response helper (401)
export function apiUnauthorized(message = 'Unauthorized'): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: message,
      code: 'UNAUTHORIZED',
    },
    { status: 401 }
  );
}

// Forbidden response helper (403)
export function apiForbidden(message = 'Forbidden'): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: message,
      code: 'FORBIDDEN',
    },
    { status: 403 }
  );
}

// Not found response helper (404)
export function apiNotFound(message = 'Not found'): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: message,
      code: 'NOT_FOUND',
    },
    { status: 404 }
  );
}

// Too many requests response helper (429)
export function apiRateLimited(resetTime: number): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: 'Too many requests',
      code: 'RATE_LIMITED',
      details: {
        resetTime,
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
      },
    },
    { 
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
      },
    }
  );
}
