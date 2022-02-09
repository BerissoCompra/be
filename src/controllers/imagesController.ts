
//import {connect} from '../database';
import {Request, Response} from 'express';
import fs from 'fs-extra';
import path from 'path';

class ImagesController{
     
    public async subirImagen(req: any, res: Response): Promise<any>{
        const path = req.file.path;
        if(path){
            return res.status(200).json({path})
        }
        else{
            return res.status(404).json({msg: 'Error'})
        }
    }

 
}

export const imagesController = new ImagesController();