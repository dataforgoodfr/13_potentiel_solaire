'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = React.forwardRef<
	React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<CollapsiblePrimitive.Trigger asChild>
		<span
			ref={ref}
			className={cn('inline-flex cursor-pointer text-base font-normal', className)}
			{...props}
		></span>
	</CollapsiblePrimitive.Trigger>
));
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = React.forwardRef<
	React.ElementRef<typeof CollapsiblePrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, ref) => (
	<CollapsiblePrimitive.Content asChild>
		<span
			ref={ref}
			className={cn('overflow-hidden align-baseline text-sm', className)}
			{...props}
		></span>
	</CollapsiblePrimitive.Content>
));
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
