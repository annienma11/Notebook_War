using UnityEngine;
using NotebookWar.Player;

namespace NotebookWar.Pickups
{
    public class ArmorPickup : PickupBase
    {
        [Header("Armor Settings")]
        [SerializeField] private float armorAmount = 25f;
        [SerializeField] private bool restoreToFull = false;

        protected override bool CanPickup(GameObject player)
        {
            PlayerController playerController = player.GetComponent<PlayerController>();
            if (playerController == null) return false;

            // Only pickup if player armor is not at maximum
            return playerController.GetCurrentArmor() < playerController.GetMaxArmor();
        }

        protected override void ApplyEffect(GameObject player)
        {
            PlayerController playerController = player.GetComponent<PlayerController>();
            if (playerController == null) return;

            if (restoreToFull)
            {
                playerController.RestoreArmor(playerController.GetMaxArmor());
            }
            else
            {
                playerController.RestoreArmor(armorAmount);
            }
        }
    }
}