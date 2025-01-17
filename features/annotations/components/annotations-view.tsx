"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Share2,
  Settings2,
  MoreVertical,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Annotation {
  id: string;
  type: "NOTE" | "HIGHLIGHT";
  color?: "orange" | "blue" | "yellow" | "pink";
  text: string;
  note?: string;
  page: number;
}

interface AnnotationsViewProps {
  annotations: Annotation[];
  chapter: string;
  count: number;
}

export function AnnotationsView({
  annotations,
  chapter,
  count,
}: AnnotationsViewProps) {
  return (
    <div className="flex md:h-[500px] flex-col justify-end">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium">Annotations</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Settings2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">
            {chapter} <span className="text-gray-400">({count})</span>
          </h2>

          <div className="space-y-8">
            {annotations.map((annotation) => (
              <div key={annotation.id} className="flex items-stretch gap-3">
                <div className="pt-1">
                  <Star className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      PAGE {annotation.page} • {annotation.type}
                      {annotation.color &&
                        ` (${annotation.color.toUpperCase()})`}
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  {annotation.note && (
                    <div className="text-white">{annotation.note}</div>
                  )}
                  {annotation.text && (
                    <div className="relative">
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          annotation.color === "orange"
                            ? "bg-orange-500"
                            : annotation.color === "blue"
                              ? "bg-blue-500"
                              : annotation.color === "yellow"
                                ? "bg-yellow-500"
                                : "bg-pink-500"
                        }`}
                      />
                      <div className="pl-4">{annotation.text}</div>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
                  >
                    ADD NOTE
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
