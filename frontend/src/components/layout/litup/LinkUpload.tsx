import Container from "@components/layout/litup/Container";
import { Button } from "@components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@components/ui/form";
import { Input } from "@components/ui/input";
import useChangeLinkToText, { LinkFormData } from "@hooks/mutate/useChangeLinkToText";
import { useForm } from "react-hook-form";

type SubmitMutation = (data: LinkFormData) => void;

export default function LinkUpload() {
  const form = useForm<LinkFormData>();
  const { control, handleSubmit } = form;
  const { mutate: submitLink } = useChangeLinkToText();

  return (
    <Container title="방법 1: 뉴스 기사 링크로 업로드하기">
      <Form {...form}>
        <form onSubmit={handleSubmit(submitLink as SubmitMutation)} className="flex flex-row gap-4">
          <FormField
            control={control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="min-w-[250px] w-full max-w-[400px]"
                    placeholder="https://n.news.naver.com/..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">업로드</Button>
        </form>
      </Form>
    </Container>
  );
}
