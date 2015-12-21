var EsoItemLinkPopup = null;
var EsoItemLinkPopup_Visible = false;
var EsoItemLinkPopup_LastItemId = -1;
var EsoItemLinkPopup_LastIntLevel = -1;
var EsoItemLinkPopup_LastIntType = -1;
var EsoItemLinkPopup_LastItemLink = '';


function CreateEsoItemLinkPopup()
{
	EsoItemLinkPopup = $('<div />').addClass('eso_item_link_popup').hide();
	$('body').append(EsoItemLinkPopup);
}


function ShowEsoItemLinkPopup(parent, itemId, itemLink, intLevel, intType)
{
	var linkSrc = "http://esoitem.uesp.net/itemLink.php?itemid=" + itemId + "&embed";
	
	if (itemId <= 0) return;
	linkSrc += "&itemid=" + itemId;
	if (itemLink) linkSrc += "&link=" + itemLink;
	if (intLevel) linkSrc += "&intlevel=" + intLevel;
	if (intType) linkSrc += "&inttype=" + intType;
	
	if (EsoItemLinkPopup == null) CreateEsoItemLinkPopup();
	
	var position = $(parent).offset();
	var width = $(parent).width();
	EsoItemLinkPopup.css({ top: position.top - 150, left: position.left + width });
	
	EsoItemLinkPopup_Visible = true;
	
	if (EsoItemLinkPopup_LastItemId == itemId && EsoItemLinkPopup_LastIntLevel == intLevel && EsoItemLinkPopup_LastIntType == intType)
	{
		EsoItemLinkPopup.show();
		AdjustEsoItemLinkTooltipPosition(EsoItemLinkPopup, $(parent));
	}
	else
	{
		EsoItemLinkPopup.load(linkSrc, "", function() { 
			EsoItemLinkPopup_LastItemId = itemId; 
			EsoItemLinkPopup_LastIntLevel = intLevel;
			EsoItemLinkPopup_LastIntType = intType;
			EsoItemLinkPopup_LastItemLink = itemLink;
			if (EsoItemLinkPopup_Visible) EsoItemLinkPopup.show();
			AdjustEsoItemLinkTooltipPosition(EsoItemLinkPopup, $(parent));
		});
	}
	
}


function AdjustEsoItemLinkTooltipPosition(tooltip, parent)
{
     var windowWidth = $(window).width();
     var windowHeight = $(window).height();
     var toolTipWidth = tooltip.width();
     var toolTipHeight = tooltip.height();
     var elementHeight = parent.height();
     var elementWidth = parent.width();
     
     var top = parent.offset().top - 150;
     var left = parent.offset().left + parent.outerWidth() + 3;
     
     tooltip.offset({ top: top, left: left });
     
     var viewportTooltip = tooltip[0].getBoundingClientRect();
     
     if (viewportTooltip.bottom > windowHeight) 
     {
    	 var deltaHeight = viewportTooltip.bottom - windowHeight + 10;
         top = top - deltaHeight
     }
     else if (viewportTooltip.top < 0)
     {
    	 var deltaHeight = viewportTooltip.top - 10;
         top = top - deltaHeight
     }
         
     if (viewportTooltip.right > windowWidth) 
     {
         left = left - toolTipWidth - parent.width() - 28;
     }
     
     tooltip.offset({ top: top, left: left });
}


function HideEsoItemLinkPopup()
{
	EsoItemLinkPopup_Visible = false;
	if (EsoItemLinkPopup == null) return;
	EsoItemLinkPopup.hide();
}


function OnEsoItemLinkEnter()
{
	ShowEsoItemLinkPopup(this, $(this).attr('itemid'), $(this).attr('itemlink'), $(this).attr('intlevel'), $(this).attr('inttype'));
}


function OnEsoItemLinkLeave()
{
	HideEsoItemLinkPopup();
}
