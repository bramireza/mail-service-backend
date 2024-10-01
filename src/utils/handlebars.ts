import Handlebars from 'handlebars';

interface CompileTemplateArgs {
  htmlPart: string
  templateData: Record<string, unknown>
}

export const compileTemplate = ({ htmlPart, templateData }: CompileTemplateArgs): string => {
  const template = Handlebars.compile(htmlPart);
  
  return template(templateData);
};