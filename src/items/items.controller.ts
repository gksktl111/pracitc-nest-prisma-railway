import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // ✅ 전체 조회
  @Get()
  findAll() {
    return this.itemsService.findAllItems();
  }

  // ✅ 단일 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findItemById(id);
  }

  // --- 기존 코드 ---
  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.createItem(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.updateItem(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.deleteItem(id);
  }
}
