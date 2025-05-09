'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layouts/MainLayout';
import { CheckCircle, Clock, FileText, Search, SendHorizontal, UserCircle, FileCheck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GuidePage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">민원 서비스 이용안내</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="process">
              <TabsList className="grid grid-cols-3 w-full mb-8">
                <TabsTrigger value="process">민원 처리 절차</TabsTrigger>
                <TabsTrigger value="require