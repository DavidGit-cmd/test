import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string }[];
  correctAnswer: string;
}

interface Section {
  title: string;
  questions: Question[];
}

interface ExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examTitle: string;
  sections: Section[];
}

export default function ExamDialog({ open, onOpenChange, examTitle, sections }: ExamDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const allQuestions = sections.flatMap(section => section.questions);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    allQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const allAnswered = allQuestions.every(q => answers[q.id]);
  const percentage = submitted ? Math.round((score / allQuestions.length) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{examTitle}</DialogTitle>
          <DialogDescription>
            Besvare alle spørsmålene og trykk på "Send inn" når du er ferdig
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="space-y-6 py-4">
            <Card className={`${percentage >= 70 ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'}`}>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  {percentage >= 70 ? (
                    <CheckCircle className="h-16 w-16 mx-auto text-success" />
                  ) : (
                    <XCircle className="h-16 w-16 mx-auto text-destructive" />
                  )}
                  <div>
                    <h3 className="text-3xl font-bold">{percentage}%</h3>
                    <p className="text-muted-foreground mt-2">
                      Du fikk {score} av {allQuestions.length} spørsmål riktig
                    </p>
                  </div>
                  <p className="font-medium">
                    {percentage >= 70 ? 'Gratulerer! Du har bestått!' : 'Du må ha minst 70% for å bestå. Prøv igjen!'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-4">
              <div className="bg-button-teal text-white px-4 py-3 rounded-lg">
                <h3 className="text-lg font-semibold">
                  {section.title}
                </h3>
              </div>
                  {section.questions.map((question, questionIndex) => {
                    const globalIndex = sections
                      .slice(0, sectionIndex)
                      .reduce((acc, s) => acc + s.questions.length, 0) + questionIndex;
                    const userAnswer = answers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <Card key={question.id} className={`${isCorrect ? 'border-success/50' : 'border-destructive/50'}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-3">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 space-y-2">
                              <p className="font-medium">Spørsmål {globalIndex + 1}: {question.question}</p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Ditt svar: </span>
                                <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                                  {question.options.find(o => o.value === userAnswer)?.label}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-sm">
                                  <span className="text-muted-foreground">Riktig svar: </span>
                                  <span className="text-success">
                                    {question.options.find(o => o.value === question.correctAnswer)?.label}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Prøv igjen
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Lukk
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
            <div className="bg-button-teal text-white px-4 py-3 rounded-lg">
              <h3 className="text-lg font-semibold">
                {section.title}
              </h3>
            </div>
                {section.questions.map((question, questionIndex) => {
                  const globalIndex = sections
                    .slice(0, sectionIndex)
                    .reduce((acc, s) => acc + s.questions.length, 0) + questionIndex;
                  
                  return (
                    <Card key={question.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <p className="font-medium">
                            {globalIndex + 1}. {question.question}
                          </p>
                          <RadioGroup 
                            value={answers[question.id]} 
                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                          >
                            {question.options.map(option => (
                              <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                                <Label 
                                  htmlFor={`${question.id}-${option.value}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ))}

            <div className="flex space-x-3 pt-4">
              <Button onClick={handleClose} variant="outline" className="flex-1">
                Avbryt
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!allAnswered}
                className="flex-1"
              >
                Send inn
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
