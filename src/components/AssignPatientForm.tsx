
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doctorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { type RelationshipType } from "@/types";

const formSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  relationshipType: z.string(),
});

interface AssignPatientFormProps {
  doctorId: string;
  patients: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function AssignPatientForm({ doctorId, patients, onSuccess }: AssignPatientFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      relationshipType: "PRIMARY_CARE",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await doctorAPI.assignPatient(
        doctorId, 
        values.patientId, 
        values.relationshipType as RelationshipType
      );
      
      toast({
        title: "Patient assigned",
        description: "Patient has been successfully assigned to the doctor.",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to assign patient:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="relationshipType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PRIMARY_CARE">Primary Care</SelectItem>
                  <SelectItem value="SPECIALIST">Specialist</SelectItem>
                  <SelectItem value="CONSULTING">Consulting</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Assigning..." : "Assign Patient"}
        </Button>
      </form>
    </Form>
  );
}
