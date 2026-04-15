import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchRoomsDto } from './dto/search-rooms.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  // Fr27-29
  @Get('rooms')
  @ApiOperation({ summary: 'Search available rooms' })
  searchRooms(@Query() dto: SearchRoomsDto) {
    return this.searchService.searchRooms(dto);
  }
}