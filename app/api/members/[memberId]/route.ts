import { ProfilCurent } from "@/lib/profil-curent"
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { membruId:string }}
) {
    try {
        const profil = await ProfilCurent();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if(!profil){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!serverId) {
            return new NextResponse("Server ID is missing", { status: 400 });
        }
        if(!params.membruId) {
            return new NextResponse("Member ID is missing", { status: 400 });
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                idutilizator: profil.id,
            },
            data: {
                membrii: {
                    deleteMany:{
                        id: params.membruId,
                        idutilizator: {
                            not: profil.id
                        }
                    }
                }
            },
            include:{
                membrii:{
                    include: {
                        profil: true,
                    },
                    orderBy: {rol:"asc"}
                }
            }
        });
        
        return NextResponse.json(server);

    } catch (error){
        console.log("[MEMBERS_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status:500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { memberId:string }}
) {
    try{
        const profil = await ProfilCurent();
        const { searchParams } = new URL(req.url);
        const { rol } = await req.json();

        const serverId = searchParams.get("serverId");

        if (!profil) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID is missing", { status: 400 });
        }

        if(!params.memberId) {
            return new NextResponse("Member ID is missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                idutilizator: profil.id,
            },
            data: {
                membrii: {
                    update: {
                        where: {
                            id: params.memberId,
                            idutilizator:{
                                not: profil.id
                            }
                        },
                        data: {
                            rol
                        }
                    }
                }
            },
            include: {
                membrii: {
                    include: {
                        profil: true,
                    },
                    orderBy: {
                        rol:"asc"
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error){
        console.log("[MEMBERS_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status:500 });
    }
}