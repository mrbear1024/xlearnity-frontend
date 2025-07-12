import React from 'react';
import { useForm, UseFormReturn, FieldValues, Path, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  FormFieldProps, 
  InputProps, 
  TextareaProps, 
  SelectProps, 
  CheckboxProps, 
  SwitchProps,
  BaseComponentProps 
} from '@/types/components';

// 表单上下文
interface FormContextType<T extends FieldValues> {
  form: UseFormReturn<T>;
  disabled?: boolean;
}

const FormContext = React.createContext<FormContextType<any> | null>(null);

// 表单根组件
interface FormProps<T extends FieldValues> extends BaseComponentProps {
  schema?: z.ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  disabled?: boolean;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  disabled = false,
  mode = 'onChange',
  children,
  className,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  return (
    <FormContext.Provider value={{ form, disabled }}>
      <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// 表单字段包装器
interface FormFieldWrapperProps extends BaseComponentProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export function FormFieldWrapper({
  name,
  label,
  description,
  required,
  children,
  className,
}: FormFieldWrapperProps) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('FormFieldWrapper must be used within a Form');

  const { form } = context;
  const error = form.formState.errors[name];

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className={cn(required && 'after:content-["*"] after:ml-1 after:text-red-500')}>
          {label}
        </Label>
      )}
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}

// 表单输入框
interface FormInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  name: string;
}

export function FormInput({ name, ...props }: FormInputProps) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('FormInput must be used within a Form');

  const { form, disabled } = context;
  const field = form.register(name);

  return (
    <FormFieldWrapper name={name} label={props.label} description={props.description} required={props.required}>
      <Input
        {...field}
        {...props}
        disabled={disabled || props.disabled}
        className={cn(props.className)}
      />
    </FormFieldWrapper>
  );
}

// 表单文本区域
interface FormTextareaProps extends Omit<TextareaProps, 'value' | 'onChange'> {
  name: string;
}

export function FormTextarea({ name, ...props }: FormTextareaProps) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('FormTextarea must be used within a Form');

  const { form, disabled } = context;
  const field = form.register(name);

  return (
    <FormFieldWrapper name={name} label={props.label} description={props.description} required={props.required}>
      <Textarea
        {...field}
        {...props}
        disabled={disabled || props.disabled}
        className={cn(props.className)}
      />
    </FormFieldWrapper>
  );
}

// 表单选择器
interface FormSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  name: string;
}

export function FormSelect({ name, options, ...props }: FormSelectProps) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('FormSelect must be used within a Form');

  const { form, disabled } = context;
  const value = form.watch(name);

  return (
    <FormFieldWrapper name={name} label={props.label} description={props.description} required={props.required}>
      <Select
        value={value}
        onValueChange={(value) => form.setValue(name as Path<any>, value)}
        disabled={disabled || props.disabled}
      >
        <SelectTrigger className={cn(props.className)}>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  );
}

// 表单复选框
interface FormCheckboxProps extends Omit<CheckboxProps, 'checked' | 'onChange'> {
  name: string;
}

export function FormCheckbox({ name, ...props }: FormCheckboxProps) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('FormCheckbox must be used within a Form');

  const { form, disabled } = context;
  const value = form.watch(name);

  return (
    <FormFieldWrapper name={name} label={props.label} description={props.description} required={props.required}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          checked={value}
          onCheckedChange={(checked) => form.setValue(name as Path<any>, checked)}
          disabled={disabled || props.disabled}
          className={cn(props.className)}
        />
        {props.label && (
          <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {props.label}
          </Label>
        )}
      </div>
    </FormFieldWrapper>
  );
}

// 表单开关
interface FormSwitchProps extends Omit<SwitchProps, 'checked' | 'onChange'> {
  name: string;
}

export function FormSwitch({ name, ...props }: FormSwitchProps) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('FormSwitch must be used within a Form');

  const { form, disabled } = context;
  const value = form.watch(name);

  return (
    <FormFieldWrapper name={name} label={props.label} description={props.description} required={props.required}>
      <div className="flex items-center space-x-2">
        <Switch
          id={name}
          checked={value}
          onCheckedChange={(checked) => form.setValue(name as Path<any>, checked)}
          disabled={disabled || props.disabled}
          className={cn(props.className)}
        />
        {props.label && (
          <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {props.label}
          </Label>
        )}
      </div>
    </FormFieldWrapper>
  );
}

// 表单提交按钮
interface FormSubmitProps extends BaseComponentProps {
  loading?: boolean;
  loadingText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function FormSubmit({ 
  loading = false, 
  loadingText = 'Loading...', 
  variant = 'default',
  size = 'default',
  children = 'Submit',
  className,
  ...props 
}: FormSubmitProps) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('FormSubmit must be used within a Form');

  const { form, disabled } = context;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={disabled || loading || isSubmitting}
      className={cn(className)}
      {...props}
    >
      {loading || isSubmitting ? loadingText : children}
    </Button>
  );
}

// 表单重置按钮
interface FormResetProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function FormReset({ 
  variant = 'outline',
  size = 'default',
  children = 'Reset',
  className,
  ...props 
}: FormResetProps) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('FormReset must be used within a Form');

  const { form, disabled } = context;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={() => form.reset()}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  );
}

// 表单操作栏
interface FormActionsProps extends BaseComponentProps {
  justify?: 'start' | 'center' | 'end' | 'between';
}

export function FormActions({ 
  justify = 'end', 
  children, 
  className 
}: FormActionsProps) {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn('flex items-center gap-2', justifyClasses[justify], className)}>
      {children}
    </div>
  );
}

// 表单分组
interface FormGroupProps extends BaseComponentProps {
  title?: string;
  description?: string;
}

export function FormGroup({ title, description, children, className }: FormGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// 默认导出
export default Form; 