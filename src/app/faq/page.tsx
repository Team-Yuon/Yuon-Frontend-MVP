'use client';

import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { faqAPI } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layouts/MainLayout';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const data = await faqAPI.getAll();
        setFaqs(data);
        setError(null);
      } catch (err) {
        setError('FAQ를 불러오는데 실패했습니다. 다시 시도해주세요.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'general', name: '일반' },
    { id: 'account', name: '계정' },
    { id: 'complaint', name: '민원' },
    { id: 'process', name: '처리 과정' },
    { id: 'technical', name: '기술 지원' },
  ];

  const filteredFaqs = activeTab === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeTab);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">자주 묻는 질문 (FAQ)</CardTitle>
            <CardDescription className="text-center text-lg">
              유성구청 민원 서비스에 대한 자주 묻는 질문들을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-8">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeTab}>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                    >
                      다시 시도
                    </Button>
                  </div>
                ) : filteredFaqs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">해당 카테고리에 FAQ가 없습니다.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg p-1">
                        <AccordionTrigger className="text-left px-4 py-3 hover:no-underline">
                          <div className="font-medium text-lg">{faq.question}</div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-1">
                          <div className="text-gray-700 whitespace-pre-line">{faq.answer}</div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                원하는 답변을 찾지 못하셨나요? 1:1 문의를 이용해주세요.
              </p>
              <Button>1:1 문의하기</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FAQPage;
