import Container from "@components/layout/litup/Container";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import useNewsStorage from "@hooks/storage/useNewsStorage";
import RoutePath from "@routes/routePath";
import { useForm } from "react-hook-form";

type TextFormData = { text: string };

export default function TextUpload() {
  const form = useForm<TextFormData>();
  const { control, handleSubmit } = form;

  const [, setNews] = useNewsStorage();

  function onSubmit({ text: content }: TextFormData) {
    setNews({ title: "사용자 입력 기사", content });
    window.location.href = RoutePath.News;
  }

  return (
    <Container title="방법 2: 뉴스 기사 전문 업로드하기">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormField
            control={control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="뉴스 기사를 적어주세요" {...field} />
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
