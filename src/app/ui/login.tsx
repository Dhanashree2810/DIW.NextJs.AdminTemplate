'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import bg from '@/assets/images/login.jpg';
import { login } from '../actions/auth';
import { useFormState, useFormStatus } from 'react-dom'


export function LoginForm() {
  const [state, action] = useFormState(login, undefined)

  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-gray-100"
      style={{ backgroundImage: `url(${bg.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <Card className=' border-none'>
          <CardHeader>
            <CardTitle className="text-center font-bold text-3xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={action} noValidate className="space-y-4">
              <div className="form-group mb-6">
                <Label htmlFor="emailId" className='font-bold'>Email Address</Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter Your Username / Email"
                  className="form-control mt-3"
                  required
                />
                {state?.errors?.email && <p>{state.errors.email}</p>}

              </div>
              <div className="form-group mb-3">
                <Label htmlFor="password" className='font-bold'>Password *</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Your Password"
                  className="form-control mt-3"
                  required
                />
                {state?.errors?.password && <p>{state.errors.password}</p>}

              </div>

              <div className="btnContainer">
                <SubmitButton />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-green-700 text-white py-2 rounded-lg font-bold">
      {'Login'}
    </Button>
  )
}
