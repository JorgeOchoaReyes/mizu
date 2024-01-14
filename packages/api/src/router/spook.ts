import { promises as fs } from "fs";
import path from "path";
import Docxtemplater from "docxtemplater";
import { Configuration, OpenAIApi } from "openai";
import PizZip from "pizzip";
import { z } from "zod";

import type { paragraph, Spook } from "@acme/db";

import type { Result } from "../../types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const speakRouter = createTRPCRouter({
  makeQuery: publicProcedure
    .input(z.object({ query: z.string(), text: z.string() }))
    .mutation(async ({ input }) => {
      const query = input.query;
      const text = input.text;
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_KEY,
      });
      const openai = new OpenAIApi(configuration);
      try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Can you make this text more ${query}: ${text}`,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 1,
        });
        if (!completion.data.choices[0]?.text) {
          const results: Result<undefined> = {
            error: true,
            message: "No response from AI",
            success: false,
            data: undefined,
          };
          return results;
        }
        // console.log(completion.data.choices);
        const results: Result<string> = {
          error: false,
          message: "Success",
          success: true,
          data: completion.data.choices[0]?.text,
        };
        return results;
      } catch (error) {
        const results: Result<undefined> = {
          error: true,
          message: (error as { message: string }).message,
          success: false,
          data: undefined,
        };
        return results;
      }
    }),
  createWordDocument: publicProcedure
    .input(z.object({ document: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const dir = path.join(process.cwd(), "templates");
      //Read the json data file data.json
      const content = await fs.readFile(dir + "/default.docx", "binary");
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      doc.setData({ paragraphs: input.document.map((p) => ({ text: p })) });
      doc.render();

      const buf: any = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
      });

      const file = {
        content: Buffer.from(buf, "utf-8").toString("base64"),
        filename: "cateringlabels.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        disposition: "attachment",
      };

      const results: Result<string> = {
        error: false,
        message: "Success",
        success: true,
        data: file.content,
      };

      return results;
    }),
  saveSpook: protectedProcedure
    .input(
      z.object({
        document: z.array(z.string()),
        title: z.string(),
        spookId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { title } = input;
      let { document, spookId } = input;
      const { prisma } = ctx;
      const userId = ctx.session.user.id;

      if (!userId) {
        const results: Result<undefined> = {
          error: true,
          message: "Not logged in",
          success: false,
          data: undefined,
        };
        return results;
      }
      try {
        if (!spookId) spookId = Math.random().toString(36).substring(7);

        const formattedDoc: {
          text: string;
          index: number;
          spookId: string;
        }[] = document.map((p, i) => {
          return {
            text: p,
            index: i,
            spookId: spookId,
          };
        });

        await prisma.paragraph.createMany({
          data: formattedDoc,
        });

        const paragraphs = await prisma.paragraph.findMany({
          where: { spookId: spookId },
        });

        const spook = await prisma.spook.upsert({
          where: { id: spookId },
          update: { title: title },
          create: {
            id: spookId,
            title: title,
            userId: userId,
          },
        });

        await prisma.user.upsert({
          where: { id: userId },
          update: {
            spooks: {
              connect: { id: spookId },
            },
          },
          create: {
            id: userId,
            email: ctx.session.user?.email ?? "",
            name: ctx.session.user?.name ?? "",
          },
        });

        await prisma.spook.update({
          where: { id: spookId },
          data: {
            document: {
              connect: paragraphs.map((p) => ({ id: p.id })),
            },
            user: {
              connect: { id: userId },
            },
          },
        });

        const results: Result<string> = {
          error: false,
          message: "Success",
          success: true,
          data: spook.id,
        };
        return results;
      } catch (error) {
        const results: Result<undefined> = {
          error: true,
          message: (error as { message: string }).message,
          success: false,
          data: undefined,
        };
        return results;
      }
    }),
  getSpooks: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const userId = ctx.session.user.id;
    if (!userId) {
      const results: Result<undefined> = {
        error: true,
        message: "Not logged in",
        success: false,
        data: undefined,
      };
      return results;
    }
    try {
      const spooks = await prisma.spook.findMany({
        where: { userId: userId },
        include: { document: true },
      });
      const results: Result<
        (Spook & {
          document: paragraph[];
        })[]
      > = {
        error: false,
        message: "Success",
        success: true,
        data: spooks,
      };
      return results;
    } catch (error) {
      const results: Result<undefined> = {
        error: true,
        message: (error as { message: string }).message,
        success: false,
        data: undefined,
      };
      return results;
    }
  }),
  findSpook: protectedProcedure
    .input(z.object({ spookId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { spookId } = input;
      const { prisma } = ctx;
      const userId = ctx.session.user.id;
      if (!userId) {
        const results: Result<undefined> = {
          error: true,
          message: "Not logged in",
          success: false,
          data: undefined,
        };
        return results;
      }
      try {
        const spook = await prisma.spook.findUnique({
          where: { id: spookId },
          include: { document: true },
        });
        const results: Result<
          | (Spook & {
              document: paragraph[];
            })
          | null
        > = {
          error: false,
          message: "Success",
          success: true,
          data: spook,
        };
        return results;
      } catch (error) {
        const results: Result<undefined> = {
          error: true,
          message: (error as { message: string }).message,
          success: false,
          data: undefined,
        };
        return results;
      }
    }),
});
