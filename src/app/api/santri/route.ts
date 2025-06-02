import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/santri - Get all santri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const halaqahId = searchParams.get('halaqahId');
    const waliId = searchParams.get('waliId');
    const search = searchParams.get('search');

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (halaqahId && halaqahId !== 'ALL') {
      where.halaqahId = halaqahId;
    }

    if (waliId && waliId !== 'ALL') {
      where.waliId = waliId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nis: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const santri = await prisma.santri.findMany({
      where,
      include: {
        wali: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        halaqah: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        hafalan: {
          select: {
            id: true,
            surahId: true,
            surahName: true,
            ayahStart: true,
            ayahEnd: true,
            type: true,
            status: true,
            grade: true,
            recordedAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        attendance: {
          select: {
            id: true,
            date: true,
            status: true
          },
          orderBy: {
            date: 'desc'
          },
          take: 10
        },
        payments: {
          select: {
            id: true,
            type: true,
            amount: true,
            status: true,
            dueDate: true
          },
          orderBy: {
            dueDate: 'desc'
          },
          take: 5
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      santri,
      total: santri.length
    });

  } catch (error) {
    console.error('Error fetching santri:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data santri' },
      { status: 500 }
    );
  }
}

// POST /api/santri - Create new santri
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nis, 
      name, 
      birthDate, 
      birthPlace, 
      gender, 
      address, 
      phone, 
      email, 
      photo, 
      status = 'ACTIVE',
      waliId,
      halaqahId,
      enrollmentDate,
      graduationDate
    } = body;

    // Validation
    if (!nis || !name || !birthDate || !birthPlace || !gender || !address || !waliId || !enrollmentDate) {
      return NextResponse.json(
        { success: false, message: 'Field wajib tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Check if NIS already exists
    const existingSantri = await prisma.santri.findUnique({
      where: { nis }
    });

    if (existingSantri) {
      return NextResponse.json(
        { success: false, message: 'NIS sudah digunakan' },
        { status: 400 }
      );
    }

    // Check if wali exists
    const wali = await prisma.user.findUnique({
      where: { id: waliId, role: 'WALI' }
    });

    if (!wali) {
      return NextResponse.json(
        { success: false, message: 'Wali tidak ditemukan' },
        { status: 400 }
      );
    }

    // Check if halaqah exists (if provided)
    if (halaqahId) {
      const halaqah = await prisma.halaqah.findUnique({
        where: { id: halaqahId }
      });

      if (!halaqah) {
        return NextResponse.json(
          { success: false, message: 'Halaqah tidak ditemukan' },
          { status: 400 }
        );
      }
    }

    // Create santri
    const santri = await prisma.santri.create({
      data: {
        nis,
        name,
        birthDate: new Date(birthDate),
        birthPlace,
        gender,
        address,
        phone: phone || null,
        email: email || null,
        photo: photo || null,
        status,
        waliId,
        halaqahId: halaqahId || null,
        enrollmentDate: new Date(enrollmentDate),
        graduationDate: graduationDate ? new Date(graduationDate) : null
      },
      include: {
        wali: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        halaqah: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Santri berhasil dibuat',
      santri
    });

  } catch (error) {
    console.error('Error creating santri:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat santri' },
      { status: 500 }
    );
  }
}
