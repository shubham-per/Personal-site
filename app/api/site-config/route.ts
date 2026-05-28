import { NextRequest, NextResponse } from "next/server"
import { supabase } from '@/lib/supabase';
import { requireAuth } from "@/lib/auth"

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('content')
            .select('title, image_url')
            .eq('section', 'site_config')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("Site Config GET error:", error)
            return NextResponse.json({ error: "Failed to fetch site config" }, { status: 500 })
        }

        return NextResponse.json({
            title: data?.title || "Shubu",
            faviconUrl: data?.image_url || undefined,
        })
    } catch (error) {
        console.error("Site Config GET error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        try {
            requireAuth(request)
        } catch {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        const contentType = request.headers.get("content-type") || ""
        let data: any = {}

        if (contentType.startsWith("multipart/form-data")) {
            const formData = await request.formData()
            for (const [key, value] of formData.entries()) {
                if (typeof value === "string") {
                    data[key] = value
                } else if (value instanceof File) {
                    const uploadFormData = new FormData()
                    uploadFormData.append('file', value)
                    uploadFormData.append('folder', 'favicon')

                    const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload-github`, {
                        method: 'POST',
                        body: uploadFormData,
                    })

                    if (uploadResponse.ok) {
                        const uploadResult = await uploadResponse.json()
                        data.faviconUrl = uploadResult.url
                    }
                }
            }
        } else {
            data = await request.json()
        }

        const { error } = await supabase
            .from('content')
            .upsert({
                section: 'site_config',
                title: data.title || 'Shubu',
                image_url: data.faviconUrl || null,
            }, { onConflict: 'section' });

        if (error) {
            console.error("Site Config POST error:", error)
            return NextResponse.json({ error: "Failed to save site config" }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            config: {
                title: data.title || 'Shubu',
                faviconUrl: data.faviconUrl || null,
            }
        })
    } catch (error) {
        console.error("Site Config POST error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
